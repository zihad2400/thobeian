import connectDB from "@/lib/mongodb";
import CustomThobeDesign from "@/models/CustomThobeDesign";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { generateDesignId, calculatePrice } from "@/config/customThobe";
import { cookies } from "next/headers";

async function getSessionId() {
  const cookieStore = await cookies();
  return cookieStore.get("thobeian_session")?.value;
}

// ===== POST: Save design =====
export async function POST(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    const sessionId = await getSessionId();
    const body = await req.json();

    const { config, name, previewImage } = body;
    if (!config) return errorResponse("Config required", 400);

    const totalPrice = calculatePrice(config);
    const designId = generateDesignId();

    const design = await CustomThobeDesign.create({
      designId,
      user: user?._id || null,
      sessionId,
      config,
      totalPrice,
      previewImage: previewImage || null,
      name: name || "My Custom Thobe",
    });

    return successResponse(
      {
        designId: design.designId,
        design: {
          _id: design._id,
          designId: design.designId,
          name: design.name,
          config: design.config,
          totalPrice: design.totalPrice,
          createdAt: design.createdAt,
        },
      },
      "Design saved successfully",
      201
    );
  } catch (error) {
    console.error("Save design error:", error);
    return errorResponse(error.message, 500);
  }
}

// ===== GET: List designs =====
export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    const sessionId = await getSessionId();
    const query = user ? { user: user._id } : { sessionId };

    const designs = await CustomThobeDesign.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return successResponse({ designs });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
