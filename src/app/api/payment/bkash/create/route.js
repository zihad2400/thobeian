import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

import { createPayment } from "@/lib/bkash";
import { getCurrentUser } from "@/lib/auth";

import {
  successResponse,
  errorResponse,
} from "@/lib/apiResponse";

export async function POST(req) {
  try {
    await connectDB();

    const user =
      await getCurrentUser();

    if (!user) {
      return errorResponse(
        "Please login first",
        401
      );
    }

    const body =
      await req.json();

    const {
      orderId,
    } = body;

    if (!orderId) {
      return errorResponse(
        "Order ID required",
        400
      );
    }

    /*
     * NEVER trust client amount.
     */
    const order =
      await Order.findOne({
        _id: orderId,
        user: user._id,
      });

    if (!order) {
      return errorResponse(
        "Order not found",
        404
      );
    }

    if (
      order.paymentMethod !==
      "bkash"
    ) {
      return errorResponse(
        "Invalid payment method",
        400
      );
    }

    if (
      order.paymentStatus ===
      "paid"
    ) {
      return errorResponse(
        "Order is already paid",
        400
      );
    }

    if (
      order.stockReleased ||
      order.orderStatus ===
        "cancelled"
    ) {
      return errorResponse(
        "This order is no longer payable",
        400
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const callbackURL =
      `${baseUrl}/api/payment/bkash/callback` +
      `?orderId=${order._id}`;

    const result =
      await createPayment({
        amount: order.total,
        orderId:
          order.orderNumber,
        callbackURL,
        payerReference:
          user.phone ||
          "01700000000",
      });

    if (
      !result ||
      result.statusCode !==
        "0000"
    ) {
      return errorResponse(
        result?.statusMessage ||
          "bKash payment creation failed",
        400
      );
    }

    order.statusHistory.push({
      status:
        "payment_initiated",

      timestamp:
        new Date(),

      note:
        "bKash payment session created",
    });

    await order.save();

    return successResponse({
      paymentID:
        result.paymentID,

      bkashURL:
        result.bkashURL,

      amount:
        order.total,

      orderId:
        order._id,
    });
  } catch (error) {
    console.error(
      "bKash create error:",
      error.response?.data ||
        error.message
    );

    return errorResponse(
      error.response?.data
        ?.statusMessage ||
        error.message ||
        "bKash failed",
      500
    );
  }
}
