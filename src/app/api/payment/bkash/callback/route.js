import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

import {
  executePayment,
} from "@/lib/bkash";

import {
  markOrderPaymentSuccess,
  markOrderPaymentFailed,
} from "@/lib/orderPayment";

export async function GET(req) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  let orderId = null;

  try {
    const {
      searchParams,
    } = new URL(req.url);

    const paymentID =
      searchParams.get(
        "paymentID"
      );

    const status =
      searchParams.get(
        "status"
      );

    orderId =
      searchParams.get(
        "orderId"
      );

    /*
     * Cancel
     */
    if (
      status === "cancel"
    ) {
      await connectDB();

      const order =
        await Order.findById(
          orderId
        );

      if (order) {
        await markOrderPaymentFailed({
          order,

          reason:
            "bKash payment cancelled by customer. Reserved stock released.",
        });
      }

      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=cancelled&orderId=${orderId}`
      );
    }

    /*
     * Failure
     */
    if (
      status === "failure"
    ) {
      await connectDB();

      const order =
        await Order.findById(
          orderId
        );

      if (order) {
        await markOrderPaymentFailed({
          order,

          reason:
            "bKash payment failed. Reserved stock released.",
        });
      }

      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=failed&orderId=${orderId}`
      );
    }

    if (!paymentID) {
      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=no_payment_id&orderId=${orderId}`
      );
    }

    /*
     * Execute payment with bKash.
     */
    const result =
      await executePayment(
        paymentID
      );

    if (
      !result ||
      result.statusCode !==
        "0000"
    ) {
      await connectDB();

      const order =
        await Order.findById(
          orderId
        );

      if (order) {
        await markOrderPaymentFailed({
          order,

          reason:
            "bKash payment execution failed. Reserved stock released.",
        });
      }

      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=execution_failed&orderId=${orderId}`
      );
    }

    await connectDB();

    const order =
      await Order.findById(
        orderId
      );

    if (!order) {
      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=order_not_found`
      );
    }

    await markOrderPaymentSuccess({
      order,

      paymentMethod:
        "bkash",

      transactionId:
        result.trxID ||
        paymentID,

      note:
        `bKash payment successful. TrxID: ${
          result.trxID ||
          paymentID
        }`,
    });

    return NextResponse.redirect(
      `${baseUrl}/checkout/success?order=${order.orderNumber}`
    );
  } catch (error) {
    console.error(
      "bKash callback error:",
      error
    );

    return NextResponse.redirect(
      `${baseUrl}/checkout/failed?reason=callback_error&orderId=${orderId || ""}`
    );
  }
}
