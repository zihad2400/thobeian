import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

import {
  initializePayment,
  completePayment,
} from "@/lib/nagad";

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
      "nagad"
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
      `${baseUrl}/api/payment/nagad/callback` +
      `?orderId=${order._id}`;

    const initResponse =
      await initializePayment({
        orderId:
          order.orderNumber,

        amount:
          order.total,

        callbackURL,
      });

    if (
      !initResponse?.sensitiveData
    ) {
      return errorResponse(
        "Nagad initialization failed",
        400
      );
    }

    const paymentReferenceId =
      initResponse.paymentReferenceId;

    const completeResponse =
      await completePayment({
        paymentReferenceId,

        orderId:
          order.orderNumber,

        amount:
          order.total,
      });

    if (
      !completeResponse?.callBackUrl ||
      completeResponse.status !==
        "Success"
    ) {
      return errorResponse(
        completeResponse?.message ||
          "Nagad complete failed",
        400
      );
    }

    order.statusHistory.push({
      status:
        "payment_initiated",

      timestamp:
        new Date(),

      note:
        "Nagad payment session created",
    });

    await order.save();

    return successResponse({
      paymentReferenceId,

      callBackUrl:
        completeResponse.callBackUrl,

      amount:
        order.total,

      orderId:
        order._id,
    });
  } catch (error) {
    console.error(
      "Nagad create error:",
      error.response?.data ||
        error.message
    );

    return errorResponse(
      error.response?.data
        ?.message ||
        error.message ||
        "Nagad failed",
      500
    );
  }
}
