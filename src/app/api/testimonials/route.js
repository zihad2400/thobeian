import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

// ===== GET: List testimonials =====
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "10");

    const filter = { isActive: true };
    if (featured === "true") filter.isFeatured = true;

    const testimonials = await Testimonial.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    return successResponse({ testimonials });
  } catch (error) {
    console.error("Testimonials GET error:", error);
    return errorResponse(error.message, 500);
  }
}

// ===== POST: Create testimonial =====
export async function POST(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const { name, city, rating, comment } = body;

    if (!name || !comment || !rating) {
      return errorResponse("Name, rating, and comment are required", 400);
    }

    // Only admin can create directly, customers go to "pending"
    const isAdmin = user.role === "admin" || user.role === "superadmin";

    const testimonial = await Testimonial.create({
      name,
      city: city || "Dhaka",
      rating: Number(rating),
      comment,
      source: isAdmin ? "admin" : "customer",
      isActive: isAdmin, // Admin submissions auto-approve, customer go to pending
      isFeatured: isAdmin,
    });

    return successResponse(
      { testimonial },
      isAdmin
        ? "Testimonial added"
        : "Thank you! Your review will be published after approval.",
      201
    );
  } catch (error) {
    console.error("Testimonials POST error:", error);
    return errorResponse(error.message, 500);
  }
}
