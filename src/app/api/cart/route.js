import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { cookies } from "next/headers";
import crypto from "crypto";

async function getSessionId() {
  const cookieStore = await cookies();
  return cookieStore.get("thobeian_session")?.value;
}

async function getOrCreateSessionId() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("thobeian_session")?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();

    cookieStore.set("thobeian_session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return sessionId;
}

export async function GET() {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const sessionId = await getSessionId();

    let cart;

    if (user) {
      cart = await Cart.findOne({ user: user._id });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    return successResponse({
      items: cart?.items || [],
    });
  } catch (error) {
    console.error("Cart GET error:", error);
    return errorResponse(error.message, 500);
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const body = await req.json();

    const {
      productId,
      size,
      color,
      quantity = 1,
      price,
      name,
      image,
    } = body;

    if (!productId || !size) {
      return errorResponse("Product and size required", 400);
    }

    let cart;

    if (user) {
      cart = await Cart.findOne({ user: user._id });

      if (!cart) {
        cart = await Cart.create({
          user: user._id,
          items: [],
        });
      }
    } else {
      const sessionId = await getOrCreateSessionId();

      cart = await Cart.findOne({ sessionId });

      if (!cart) {
        cart = await Cart.create({
          sessionId,
          items: [],
        });
      }
    }

    const existingIdx = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingIdx >= 0) {
      cart.items[existingIdx].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        size,
        color,
        quantity,
        price,
        name,
        image,
      });
    }

    await cart.save();

    return successResponse(
      {
        items: cart.items,
      },
      "Added to cart"
    );
  } catch (error) {
    console.error("Cart POST error:", error);
    return errorResponse(error.message, 500);
  }
}

export async function DELETE() {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const sessionId = await getSessionId();

    if (user) {
      await Cart.findOneAndUpdate(
        { user: user._id },
        { items: [] }
      );
    } else if (sessionId) {
      await Cart.findOneAndUpdate(
        { sessionId },
        { items: [] }
      );
    }

    return successResponse(
      {
        items: [],
      },
      "Cart cleared"
    );
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return errorResponse(error.message, 500);
  }
}
