import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { cookies } from "next/headers";

async function getSessionId() {
  const cookieStore = await cookies();
  return cookieStore.get("thobeian_session")?.value;
}

async function findCart(user) {
  if (user) {
    return Cart.findOne({ user: user._id });
  }

  const sessionId = await getSessionId();

  if (!sessionId) {
    return null;
  }

  return Cart.findOne({ sessionId });
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const { itemId } = await params;
    const { quantity } = await req.json();

    if (
      typeof quantity !== "number" ||
      !Number.isFinite(quantity)
    ) {
      return errorResponse("Invalid quantity", 400);
    }

    const cart = await findCart(user);

    if (!cart) {
      return errorResponse("Cart not found", 404);
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return errorResponse("Item not found", 404);
    }

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
    }

    cart.updatedAt = new Date();

    await cart.save();

    return successResponse({
      items: cart.items,
    });
  } catch (error) {
    console.error("Cart PATCH error:", error);
    return errorResponse(error.message, 500);
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const { itemId } = await params;

    const cart = await findCart(user);

    if (!cart) {
      return errorResponse("Cart not found", 404);
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemId
    );

    if (cart.items.length === originalLength) {
      return errorResponse("Item not found", 404);
    }

    cart.updatedAt = new Date();

    await cart.save();

    return successResponse({
      items: cart.items,
    });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return errorResponse(error.message, 500);
  }
}
