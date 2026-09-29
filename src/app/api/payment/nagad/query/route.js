import { verifyPayment } from "@/lib/nagad";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function POST(req) {
  try {
    const body = await req.json();
    const { paymentReferenceId } = body;

    if (!paymentReferenceId) {
      return errorResponse("Payment Reference ID required", 400);
    }

    const result = await verifyPayment(paymentReferenceId);
    return successResponse(result);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
