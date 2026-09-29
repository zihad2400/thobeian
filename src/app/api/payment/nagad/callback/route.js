import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import { completePayment, verifyPayment } from "@/lib/nagad";

export async function GET(req) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const { searchParams } = new URL(req.url);
    const paymentReferenceId = searchParams.get("payment_ref_id");
    const status = searchParams.get("status");
    const orderId = searchParams.get("orderId");

    if (status === "cancel") {
      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=cancelled&orderId=${orderId}`
      );
    }

    if (!paymentReferenceId) {
      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=no_reference&orderId=${orderId}`
      );
    }

    // Verify payment status
    const verifyResponse = await verifyPayment(paymentReferenceId);

    if (verifyResponse?.status !== "Success") {
      return NextResponse.redirect(
        `${baseUrl}/checkout/failed?reason=verification_failed&orderId=${orderId}`
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
    order.paymentMethod = "nagad";
    order.paymentTransactionId =
      verifyResponse.issuerPaymentRefNo || paymentReferenceId;
    order.paymentVerifiedAt = new Date();
    order.orderStatus = "confirmed";
    order.statusHistory.push({
      status: "confirmed",
      timestamp: new Date(),
      note: `Nagad payment successful. Ref: ${paymentReferenceId}`,
    });
    await order.save();

    // Clear cart
    await Cart.findOneAndUpdate({ user: order.user }, { items: [] });

    return NextResponse.redirect(
      `${baseUrl}/checkout/success?order=${order.orderNumber}`
    );
  } catch (error) {
    console.error("Nagad callback error:", error.message);
    return NextResponse.redirect(
      `${baseUrl}/checkout/failed?reason=callback_error`
    );
  }
}
