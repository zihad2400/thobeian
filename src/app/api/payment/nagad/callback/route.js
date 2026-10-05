import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

import {
  verifyPayment,
} from "@/lib/nagad";

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

    const paymentReferenceId =
      searchParams.get(
        "payment_ref_id"
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
     * Customer cancelled.
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
            "Nagad payment cancelled by customer. Reserved stock released.",
        });
      }

      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=cancelled&orderId=${orderId}`
      );
    }

    if (!paymentReferenceId) {
      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=no_reference&orderId=${orderId}`
      );
    }

    /*
     * Verify payment directly with Nagad.
     */
    const verifyResponse =
      await verifyPayment(
        paymentReferenceId
      );

    if (
      verifyResponse?.status !==
      "Success"
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
            "Nagad payment verification failed. Reserved stock released.",
        });
      }

      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=verification_failed&orderId=${orderId}`
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
        "nagad",

      transactionId:
        verifyResponse.issuerPaymentRefNo ||
        paymentReferenceId,

      note:
        `Nagad payment successful. Ref: ${paymentReferenceId}`,
    });

    return NextResponse.redirect(
      `${baseUrl}/checkout/success?order=${order.orderNumber}`
    );
  } catch (error) {
    console.error(
      "Nagad callback error:",
      error
    );

    return NextResponse.redirect(
      `${baseUrl}/checkout/failed?reason=callback_error&orderId=${orderId || ""}`
    );
  }
}
