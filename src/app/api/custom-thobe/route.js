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

    if (!config) {
      return errorResponse("Config required", 400);
    }

    /*
     * Preview images are generated SVG data URLs.
     * Keep a strict payload limit so malformed clients
     * cannot store unexpectedly large values in MongoDB.
     */
    if (
      previewImage &&
      typeof previewImage !== "string"
    ) {
      return errorResponse(
        "Invalid preview image",
        400
      );
    }

    if (
      previewImage &&
      previewImage.length > 500000
    ) {
      return errorResponse(
        "Preview image is too large",
        400
      );
    }

    const totalPrice = calculatePrice(config);

    /*
     * If the client already has a designId, update that design.
     * This prevents duplicate CustomThobeDesign documents while
     * the customer changes options or regenerates the preview.
     */
    const existingDesignId =
      typeof body.designId === "string"
        ? body.designId.trim()
        : "";

    let design = null;

    if (existingDesignId) {
      design = await CustomThobeDesign.findOne({
        designId: existingDesignId,
        ...(user
          ? { user: user._id }
          : { sessionId }),
      });

      if (design) {
        design.config = config;
        design.totalPrice = totalPrice;

        if (typeof previewImage === "string") {
          design.previewImage = previewImage;
        }

        if (typeof name === "string" && name.trim()) {
          design.name = name.trim();
        }

        await design.save();

        return successResponse(
          {
            designId: design.designId,
            design: {
              _id: design._id,
              designId: design.designId,
              name: design.name,
              config: design.config,
              totalPrice: design.totalPrice,
              previewImage:
                design.previewImage || null,
              createdAt: design.createdAt,
              updatedAt: design.updatedAt,
            },
          },
          "Design updated successfully"
        );
      }
    }

    const designId = generateDesignId();

    design = await CustomThobeDesign.create({
      designId,
      user: user?._id || null,
      sessionId,
      config,
      totalPrice,
      previewImage: previewImage || null,
      name:
        typeof name === "string" && name.trim()
          ? name.trim()
          : "My Custom Thobe",
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
          previewImage:
            design.previewImage || null,
          createdAt: design.createdAt,
          updatedAt: design.updatedAt,
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
