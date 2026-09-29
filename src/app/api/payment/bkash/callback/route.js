import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { executePayment } from "@/lib/bkash";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentID = searchParams.get("paymentID");
    const status = searchParams.get("status");
    const orderId = searchParams.get("orderId");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // User cancelled
    if (status === "cancel") {
      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=cancelled&orderId=${orderId}`
      );
    }

    // User failed
    if (status === "failure") {
      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=failed&orderId=${orderId}`
      );
    }

    if (!paymentID) {
      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=no_payment_id&orderId=${orderId}`
      );
    }

    // Execute payment
    const result = await executePayment(paymentID);

    if (!result || result.statusCode !== "0000") {
      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=execution_failed&orderId=${orderId}`
      );
    }

    // Update order
    await connectDB();
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=order_not_found`
      );
    }

    order.paymentStatus = "paid";
    order.paymentMethod = "bkash";
    order.paymentTransactionId = result.trxID || paymentID;
    order.paymentVerifiedAt = new Date();
    order.orderStatus = "confirmed";
    order.statusHistory.push({
      status: "confirmed",
      timestamp: new Date(),
      note: `bKash payment successful. TrxID: ${result.trxID}`,
    });
    await order.save();

    // Redirect to success
    return NextResponse.redirect(
      `${baseUrl}/checkout/success?order=${order.orderNumber}`
    );
  } catch (error) {
    console.error("bKash callback error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(
      `${baseUrl}/checkout/failed?reason=callback_error`
    );
  }
}
