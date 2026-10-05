import Order from "@/models/Order";
import Cart from "@/models/Cart";
import {
  getStockItemsFromOrder,
  releaseOrderStock,
} from "@/lib/orderStock";

export async function markOrderPaymentSuccess({
  order,
  paymentMethod,
  transactionId,
  note,
}) {
  if (!order) {
    throw new Error("Order not found");
  }

  /*
   * Idempotency:
   * If callback arrives twice, never process stock twice.
   */
  if (
    order.paymentStatus === "paid" &&
    order.orderStatus === "confirmed"
  ) {
    return order;
  }

  order.paymentStatus = "paid";
  order.paymentMethod = paymentMethod;
  order.paymentTransactionId =
    transactionId || order.paymentTransactionId || "";

  order.paymentVerifiedAt = new Date();

  order.orderStatus = "confirmed";

  order.statusHistory.push({
    status: "confirmed",
    timestamp: new Date(),
    note:
      note ||
      `${paymentMethod} payment successful`,
  });

  await order.save();

  /*
   * Stock remains reserved.
   * It will be consumed by the order.
   */

  await Cart.findOneAndUpdate(
    {
      user: order.user,
    },

    {
      $set: {
        items: [],
        updatedAt: new Date(),
      },
    }
  );

  return order;
}

export async function markOrderPaymentFailed({
  order,
  reason,
}) {
  if (!order) {
    throw new Error("Order not found");
  }

  /*
   * Idempotency:
   * Never release stock twice.
   */
  if (
    order.stockReleased ||
    order.orderStatus === "cancelled"
  ) {
    return order;
  }

  if (order.paymentStatus === "paid") {
    return order;
  }

  const stockItems =
    getStockItemsFromOrder(order);

  if (
    order.stockReserved &&
    stockItems.length
  ) {
    await releaseOrderStock(stockItems);
  }

  order.stockReleased = true;
  order.stockReserved = false;

  order.paymentStatus = "failed";
  order.orderStatus = "cancelled";

  order.statusHistory.push({
    status: "cancelled",
    timestamp: new Date(),
    note:
      reason ||
      "Payment failed and reserved stock was released",
  });

  await order.save();

  await Cart.findOneAndUpdate(
    {
      user: order.user,
    },

    {
      $set: {
        items: [],
        updatedAt: new Date(),
      },
    }
  );

  return order;
}
