import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    return successResponse({
      bkash: process.env.NEXT_PUBLIC_BKASH_NUMBER || "01XXXXXXXXX",
      nagad: process.env.NEXT_PUBLIC_NAGAD_NUMBER || "01XXXXXXXXX",
      rocket: process.env.NEXT_PUBLIC_ROCKET_NUMBER || "01XXXXXXXXX",
      bkashAuto:
        !!process.env.BKASH_APP_KEY &&
        process.env.BKASH_APP_KEY !== "YOUR_APP_KEY_HERE",
      nagadAuto:
        !!process.env.NAGAD_MERCHANT_ID &&
        process.env.NAGAD_MERCHANT_ID !== "YOUR_MERCHANT_ID_HERE",
    });
  } catch (error) {
    console.error("Payment config error:", error);
    return errorResponse(error.message, 500);
  }
}
