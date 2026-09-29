import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const { id } = await params;
    const order = await Order.findById(id)
      .populate("user", "name email phone")
      .lean();

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
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const { id } = await params;
    const body = await req.json();

    const order = await Order.findById(id);
    if (!order) return errorResponse("Order not found", 404);

    // Track changes
    const changes = [];

    if (body.orderStatus && body.orderStatus !== order.orderStatus) {
      order.orderStatus = body.orderStatus;
      changes.push(`Status: ${body.orderStatus}`);
      order.statusHistory.push({
        status: body.orderStatus,
        timestamp: new Date(),
        note: `Status updated by admin`,
      });
    }

    if (body.paymentStatus && body.paymentStatus !== order.paymentStatus) {
      order.paymentStatus = body.paymentStatus;
      changes.push(`Payment: ${body.paymentStatus}`);
    }

    if (body.trackingNumber !== undefined) {
      order.trackingNumber = body.trackingNumber;
      if (body.trackingNumber) changes.push(`Tracking: ${body.trackingNumber}`);
    }

    if (body.notes !== undefined) {
      order.notes = body.notes;
    }

    await order.save();

    return successResponse(
      { order },
      changes.length > 0 ? `Updated: ${changes.join(", ")}` : "Order updated"
    );
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
