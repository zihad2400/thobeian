import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const { itemId } = await params;
    const { quantity } = await req.json();

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) return errorResponse("Cart not found", 404);

    const item = cart.items.id(itemId);
    if (!item) return errorResponse("Item not found", 404);

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    return successResponse({ items: cart.items });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const { itemId } = await params;

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) return errorResponse("Cart not found", 404);

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();
    return successResponse({ items: cart.items });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
