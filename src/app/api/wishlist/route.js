import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
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

    let wishlist;

    if (user) {
      wishlist = await Wishlist.findOne({
        user: user._id,
      }).populate("products");
    } else if (sessionId) {
      wishlist = await Wishlist.findOne({
        sessionId,
      }).populate("products");
    }

    return successResponse({
      products: wishlist?.products || [],
    });
  } catch (error) {
    console.error("Wishlist GET error:", error);

    return errorResponse(
      error.message || "Failed to load wishlist",
      500
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const { productId } = await req.json();

    if (!productId) {
      return errorResponse("Product ID required", 400);
    }

    const productExists = await Product.exists({
      _id: productId,
    });

    if (!productExists) {
      return errorResponse("Product not found", 404);
    }

    let wishlist;

    if (user) {
      wishlist = await Wishlist.findOne({
        user: user._id,
      });

      if (!wishlist) {
        wishlist = await Wishlist.create({
          user: user._id,
          products: [],
        });
      }
    } else {
      const sessionId = await getOrCreateSessionId();

      wishlist = await Wishlist.findOne({
        sessionId,
      });

      if (!wishlist) {
        wishlist = await Wishlist.create({
          sessionId,
          products: [],
        });
      }
    }

    const exists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    let message;

    if (exists) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );

      message = "Removed from wishlist";
    } else {
      wishlist.products.push(productId);

      message = "Added to wishlist";
    }

    wishlist.updatedAt = new Date();

    await wishlist.save();

    const populated = await Wishlist.findById(
      wishlist._id
    )
      .populate("products")
      .lean();

    return successResponse(
      {
        products: populated?.products || [],
      },
      message
    );
  } catch (error) {
    console.error("Wishlist POST error:", error);

    return errorResponse(
      error.message || "Failed to update wishlist",
      500
    );
  }
}
