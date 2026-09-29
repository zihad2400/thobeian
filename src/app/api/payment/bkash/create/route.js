import { createPayment } from "@/lib/bkash";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse("Please login first", 401);

    const body = await req.json();
    const { amount, orderId } = body;

    if (!amount || !orderId) {
      return errorResponse("Amount and order ID required", 400);
    }

    // Build callback URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackURL = `${baseUrl}/api/payment/bkash/callback?orderId=${orderId}`;

    const result = await createPayment({
      amount,
      orderId,
      callbackURL,
      payerReference: user.phone || "01700000000",
    });

    if (!result || result.statusCode !== "0000") {
      return errorResponse(
        result?.statusMessage || "bKash payment creation failed",
        400
      );
    }

    return successResponse({
      paymentID: result.paymentID,
      bkashURL: result.bkashURL,
      amount: result.amount,
      orderId,
    });
  } catch (error) {
    console.error("bKash create error:", error.response?.data || error.message);
    return errorResponse(
      error.response?.data?.statusMessage || error.message || "bKash failed",
      500
    );
  }
}
