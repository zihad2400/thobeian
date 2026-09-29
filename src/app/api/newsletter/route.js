import connectDB from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().optional().default("footer"),
});

// ===== POST: Subscribe =====
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate
    const result = subscribeSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return errorResponse("Validation failed", 422, errors);
    }

    const { email, source } = result.data;

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return errorResponse(
          "This email is already subscribed to our newsletter",
          409
        );
      } else {
        // Reactivate
        existing.isActive = true;
        existing.unsubscribedAt = null;
        await existing.save();
        return successResponse(
          { email: existing.email },
          "Welcome back! You've been re-subscribed."
        );
      }
    }

    // Create new subscription
    const newsletter = await Newsletter.create({
      email,
      source,
      isActive: true,
    });

    return successResponse(
      { email: newsletter.email },
      "Successfully subscribed! Thank you for joining THOBEIAN Circle.",
      201
    );
  } catch (error) {
    console.error("Newsletter POST error:", error);
    return errorResponse(error.message, 500);
  }
}

// ===== GET: List subscribers (admin only later) =====
export async function GET() {
  try {
    await connectDB();
    const subscribers = await Newsletter.find({ isActive: true })
      .select("email source createdAt")
      .sort({ createdAt: -1 })
      .lean();
    return successResponse({ subscribers });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
