import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const order = await Order.findOne({
      _id: id,
      user: user._id,
    }).lean();

    if (!order) return errorResponse("Order not found", 404);

    return successResponse({ order });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const body = await req.json();

    // Only allow cancel by customer
    if (body.action === "cancel") {
      const order = await Order.findOne({ _id: id, user: user._id });
      if (!order) return errorResponse("Order not found", 404);

      if (order.orderStatus !== "pending" && order.orderStatus !== "confirmed") {
        return errorResponse("Cannot cancel this order", 400);
      }

      order.orderStatus = "cancelled";
      order.statusHistory.push({
        status: "cancelled",
        timestamp: new Date(),
        note: "Cancelled by customer",
      });
      await order.save();

      return successResponse({ order }, "Order cancelled");
    }

    return errorResponse("Invalid action", 400);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
