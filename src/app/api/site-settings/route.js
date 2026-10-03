import connectDB from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

const DEFAULT_STATS = [
  { label: "Happy Customers", value: "10K+" },
  { label: "Premium Fabrics", value: "50+" },
  { label: "Handcrafted", value: "100%" },
  { label: "Customer Rating", value: "5★" },
];

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne({}).lean();

    if (!settings) {
      settings = await SiteSettings.create({});
      settings = settings.toObject();
    }

    // Ensure brandStoryStats exists
    if (!settings.brandStoryStats || settings.brandStoryStats.length === 0) {
      settings.brandStoryStats = DEFAULT_STATS;
    }

    return successResponse({ settings });
  } catch (error) {
    console.error("SiteSettings GET error:", error);
    return errorResponse(error.message, 500);
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const body = await req.json();
    let settings = await SiteSettings.findOne({});

    if (!settings) {
      settings = await SiteSettings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }

    return successResponse({ settings }, "Settings updated");
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
