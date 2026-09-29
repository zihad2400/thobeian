import { errorResponse } from "./apiResponse";

export function asyncHandler(handler) {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error("❌ API Error:", error);

      if (error.isOperational) {
        return errorResponse(error.message, error.statusCode, error.errors);
      }

      return errorResponse(
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
        500
      );
    }
  };
}