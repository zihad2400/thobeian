import { queryPayment } from "@/lib/bkash";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function POST(req) {
  try {
    const body = await req.json();
    const { paymentID } = body;

    if (!paymentID) return errorResponse("Payment ID required", 400);

    const result = await queryPayment(paymentID);
    return successResponse(result);
  } catch (error) {
    return errorResponse(error.response?.data?.statusMessage || error.message, 500);
  }
}
