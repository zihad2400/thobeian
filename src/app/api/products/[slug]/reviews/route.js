import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductReview from "@/models/ProductReview";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

// ===== GET: List reviews for a product =====
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = await params;

    const product = await Product.findOne({ slug }).select("_id").lean();
    if (!product) return errorResponse("Product not found", 404);

    const reviews = await ProductReview.find({
      product: product._id,
      status: "approved",
    })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .lean();

    // Calculate average
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    // Rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (distribution[r.rating] !== undefined) distribution[r.rating]++;
    });

    return successResponse({
      reviews,
      summary: {
        average: Math.round(avgRating * 10) / 10,
        total: reviews.length,
        distribution,
      },
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

// ===== POST: Submit a review =====
export async function POST(req, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Please login to write a review", 401);

    const { slug } = await params;
    const body = await req.json();
    const { rating, title, comment, images } = body;

    if (!rating || !comment) {
      return errorResponse("Rating and comment are required", 400);
    }

    const product = await Product.findOne({ slug }).select("_id").lean();
    if (!product) return errorResponse("Product not found", 404);

    // Check if already reviewed
    const existing = await ProductReview.findOne({
      product: product._id,
      user: user._id,
    });
    if (existing) {
      return errorResponse("You have already reviewed this product", 409);
    }

    // Check if verified purchase
    const order = await Order.findOne({
      user: user._id,
      "items.product": product._id,
      orderStatus: "delivered",
    });

    const review = await ProductReview.create({
      product: product._id,
      user: user._id,
      order: order?._id || null,
      rating: Number(rating),
      title: title || "",
      comment,
      images: images || [],
      isVerifiedPurchase: !!order,
      status: "pending", // Admin approve করতে হবে
    });

    return successResponse(
      { review },
      "Thank you! Your review is pending approval.",
      201
    );
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
