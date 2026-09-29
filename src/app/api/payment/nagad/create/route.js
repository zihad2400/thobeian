import { initializePayment, completePayment } from "@/lib/nagad";
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

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackURL = `${baseUrl}/api/payment/nagad/callback?orderId=${orderId}`;

    // 1. Initialize payment with Nagad
    const initResponse = await initializePayment({
      orderId,
      amount,
      callbackURL,
    });

    if (!initResponse?.sensitiveData) {
      return errorResponse("Nagad initialization failed", 400);
    }

    const paymentReferenceId = initResponse.paymentReferenceId;

    // 2. Complete payment to get redirect URL
    const completeResponse = await completePayment({
      paymentReferenceId,
      orderId,
      amount,
    });

    if (
      !completeResponse?.callBackUrl ||
      completeResponse.status !== "Success"
    ) {
      return errorResponse(
        completeResponse?.message || "Nagad complete failed",
        400
      );
    }

    return successResponse({
      paymentReferenceId,
      callBackUrl: completeResponse.callBackUrl,
      amount,
      orderId,
    });
  } catch (error) {
    console.error(
      "Nagad create error:",
      error.response?.data || error.message
    );
    return errorResponse(
      error.response?.data?.message || error.message || "Nagad failed",
      500
    );
  }
}
