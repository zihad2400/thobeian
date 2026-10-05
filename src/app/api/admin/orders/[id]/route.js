import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

async function requireAdmin() {
  const user = await getCurrentUser();

  if (
    !user ||
    (user.role !== "admin" && user.role !== "superadmin")
  ) {
    return null;
  }

  return user;
}

export async function GET(req, { params }) {
  try {
    await connectDB();

    const user = await requireAdmin();

    if (!user) {
      return errorResponse("Admin access required", 403);
    }

    const { id } = await params;

    const order = await Order.findById(id)
      .populate("user", "name email phone")
      .lean();

    if (!order) {
      return errorResponse("Order not found", 404);
    }

    return successResponse({ order });
  } catch (error) {
    console.error("Admin order GET error:", error);
    return errorResponse("Failed to load order", 500);
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const user = await requireAdmin();

    if (!user) {
      return errorResponse("Admin access required", 403);
    }

    const { id } = await params;
    const body = await req.json();

    const order = await Order.findById(id);

    if (!order) {
      return errorResponse("Order not found", 404);
    }

    const changes = [];

    if (
      body.orderStatus &&
      body.orderStatus !== order.orderStatus
    ) {
      order.orderStatus = body.orderStatus;

      changes.push(`Status: ${body.orderStatus}`);

      if (!Array.isArray(order.statusHistory)) {
        order.statusHistory = [];
      }

      order.statusHistory.push({
        status: body.orderStatus,
        timestamp: new Date(),
        note: "Status updated by admin",
      });
    }

    if (
      body.paymentStatus &&
      body.paymentStatus !== order.paymentStatus
    ) {
      order.paymentStatus = body.paymentStatus;

      changes.push(`Payment: ${body.paymentStatus}`);
    }

    if (body.trackingNumber !== undefined) {
      order.trackingNumber = body.trackingNumber;

      if (body.trackingNumber) {
        changes.push(`Tracking: ${body.trackingNumber}`);
      }
    }

    if (body.notes !== undefined) {
      order.notes = body.notes;
    }

    await order.save();

    return successResponse(
      { order },
      changes.length > 0
        ? `Updated: ${changes.join(", ")}`
        : "Order updated"
    );
  } catch (error) {
    console.error("Admin order PATCH error:", error);
    return errorResponse("Failed to update order", 500);
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const user = await requireAdmin();

    if (!user) {
      return errorResponse("Admin access required", 403);
    }

    const { id } = await params;

    if (!id) {
      return errorResponse("Order ID is required", 400);
    }

    const order = await Order.findById(id);

    if (!order) {
      return errorResponse("Order not found", 404);
    }

    const orderNumber = order.orderNumber;

    await Order.deleteOne({ _id: id });

    return successResponse(
      {
        deletedId: id,
        orderNumber,
      },
      `Order ${orderNumber || id} deleted successfully`
    );
  } catch (error) {
    console.error("Admin order DELETE error:", error);
    return errorResponse("Failed to delete order", 500);
  }
}
