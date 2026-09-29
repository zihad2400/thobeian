import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import CustomThobeDesign from "@/models/CustomThobeDesign";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import {
  generateOrderNumber,
  SHIPPING_CHARGES,
  COD_FEE,
  FREE_SHIPPING_ABOVE,
} from "@/lib/orderNumber";

// Check if Nagad auto is configured
function isNagadAutoEnabled() {
  return (
    process.env.NAGAD_MERCHANT_ID &&
    process.env.NAGAD_MERCHANT_ID !== "YOUR_MERCHANT_ID_HERE" &&
    process.env.NAGAD_MERCHANT_PRIVATE_KEY &&
    process.env.NAGAD_MERCHANT_PRIVATE_KEY !== "YOUR_PRIVATE_KEY_HERE"
  );
}

// Check if bKash auto is configured
function isBkashAutoEnabled() {
  return (
    process.env.BKASH_APP_KEY &&
    process.env.BKASH_APP_KEY !== "YOUR_APP_KEY_HERE"
  );
}

// ===== GET: User's orders =====
export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const customDesigns = await CustomThobeDesign.find({ user: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return successResponse({ orders, customDesigns });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

// ===== POST: Create order =====
export async function POST(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Please login to place order", 401);

    const body = await req.json();
    const {
      customerInfo,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      transactionId,
      senderNumber,
      notes,
      items: bodyItems,
    } = body;

    // Validation
    if (!customerInfo?.name || !customerInfo?.phone) {
      return errorResponse("Name and phone required", 400);
    }
    if (!shippingAddress?.address) {
      return errorResponse("Shipping address required", 400);
    }
    if (!paymentMethod) {
      return errorResponse("Payment method required", 400);
    }

    // ===== Determine if this is AUTO or MANUAL payment =====
    const bkashAutoEnabled = isBkashAutoEnabled();
    const nagadAutoEnabled = isNagadAutoEnabled();

    // For MANUAL Nagad - require transaction ID ONLY if auto is NOT enabled
    if (paymentMethod === "nagad" && !nagadAutoEnabled) {
      if (!transactionId || !transactionId.trim()) {
        return errorResponse(
          "Transaction ID required for Nagad manual payment",
          400
        );
      }
    }

    // For MANUAL Rocket - always require transaction ID
    if (paymentMethod === "rocket") {
      if (!transactionId || !transactionId.trim()) {
        return errorResponse("Transaction ID required for Rocket payment", 400);
      }
    }

    // For bKash MANUAL - require transaction ID ONLY if auto NOT enabled
    if (paymentMethod === "bkash" && !bkashAutoEnabled) {
      if (!transactionId || !transactionId.trim()) {
        return errorResponse(
          "Transaction ID required for bKash manual payment",
          400
        );
      }
    }

    // Get items
    let items = [];
    if (bodyItems && bodyItems.length > 0) {
      items = bodyItems;
    } else {
      const cart = await Cart.findOne({ user: user._id });
      if (!cart || cart.items.length === 0) {
        return errorResponse("Cart is empty", 400);
      }
      items = cart.items.map((item) => ({
        product: item.product,
        name: item.name,
        image: item.image,
        size: item.size,
        color: item.color,
        fabric: item.fabric,
        price: item.price,
        quantity: item.quantity,
        isCustom: !!item.customConfig,
        customConfig: item.customConfig,
      }));
    }

    if (items.length === 0) {
      return errorResponse("No items to order", 400);
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCharge =
      subtotal >= FREE_SHIPPING_ABOVE
        ? 0
        : SHIPPING_CHARGES[deliveryMethod] || 80;
    const codFee = paymentMethod === "cod" ? COD_FEE : 0;
    const total = subtotal + shippingCharge + codFee;

    const orderNumber = generateOrderNumber();

    const orderData = {
      orderNumber,
      user: user._id,
      items,
      customerInfo,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      paymentStatus: "pending",
      subtotal,
      shippingCharge,
      codFee,
      total,
      notes,
      orderStatus: "pending",
      statusHistory: [
        {
          status: "pending",
          timestamp: new Date(),
          note: "Order placed successfully",
        },
      ],
    };

    // ===== Save transaction ID for MANUAL mobile payments =====
    if (transactionId && transactionId.trim()) {
      orderData.paymentTransactionId = transactionId.trim();
      orderData.senderNumber = senderNumber?.trim() || "";
      orderData.statusHistory.push({
        status: "payment_pending_verification",
        timestamp: new Date(),
        note: `Awaiting verification of ${paymentMethod} payment. Transaction: ${transactionId}`,
      });
    }

    // ===== AUTO payment history =====
    if (paymentMethod === "bkash" && bkashAutoEnabled && !transactionId) {
      orderData.statusHistory.push({
        status: "payment_initiated",
        timestamp: new Date(),
        note: "bKash automatic payment initiated - awaiting callback",
      });
    }

    if (paymentMethod === "nagad" && nagadAutoEnabled && !transactionId) {
      orderData.statusHistory.push({
        status: "payment_initiated",
        timestamp: new Date(),
        note: "Nagad automatic payment initiated - awaiting callback",
      });
    }

    const order = await Order.create(orderData);

    // Clear cart only if NOT auto payment (auto clears on callback)
    const isAutoPayment =
      (paymentMethod === "bkash" && bkashAutoEnabled && !transactionId) ||
      (paymentMethod === "nagad" && nagadAutoEnabled && !transactionId);

    if (!isAutoPayment) {
      await Cart.findOneAndUpdate({ user: user._id }, { items: [] });
    }

    return successResponse(
      {
        orderId: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod,
        orderStatus: order.orderStatus,
      },
      "Order placed successfully",
      201
    );
  } catch (error) {
    console.error("Order POST error:", error);
    return errorResponse(error.message, 500);
  }
}
