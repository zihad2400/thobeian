import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return successResponse({ products: [] });

    const wishlist = await Wishlist.findOne({ user: user._id })
      .populate("products")
      .lean();

    return successResponse({ products: wishlist?.products || [] });
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return errorResponse(error.message, 500);
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Please login first", 401);

    const { productId } = await req.json();
    if (!productId) return errorResponse("Product ID required", 400);

    let wishlist = await Wishlist.findOne({ user: user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: user._id, products: [] });
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

    await wishlist.save();

    const populated = await Wishlist.findById(wishlist._id)
      .populate("products")
      .lean();

    return successResponse(
      { products: populated.products },
      message
    );
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return errorResponse(error.message, 500);
  }
}
