import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Fabric from "@/models/Fabric";
import ProductReview from "@/models/ProductReview";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    await connectDB();

    // ===== 1. Happy Customers (Users count) =====
    const usersCount = await User.countDocuments({ isActive: true });

    // ===== 2. Premium Fabrics (Fabrics count) =====
    const fabricsCount = await Fabric.countDocuments({ isActive: true });

    // ===== 3. Handcrafted (Products with handcrafted flag OR all products) =====
    const handcraftedCount = await Product.countDocuments({
      status: "published",
      // If you have handcrafted field: handcrafted: true
    });

    // ===== 4. Customer Rating (Average of all approved reviews) =====
    const ratingData = await ProductReview.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const avgRating =
      ratingData.length > 0 && ratingData[0].avgRating
        ? Math.round(ratingData[0].avgRating * 10) / 10
        : 5.0;

    const totalReviews =
      ratingData.length > 0 ? ratingData[0].totalReviews : 0;

    // ===== Format Stats =====
    const formatCustomers = (n) => {
      if (n >= 1000) return `${Math.floor(n / 1000)}K+`;
      if (n >= 100) return `${n}+`;
      return `${n}`;
    };

    const stats = [
      {
        label: "Happy Customers",
        value: formatCustomers(usersCount),
        rawValue: usersCount,
        auto: true,
      },
      {
        label: "Premium Fabrics",
        value: `${fabricsCount}+`,
        rawValue: fabricsCount,
        auto: true,
      },
      {
        label: "Handcrafted",
        value: "100%",
        rawValue: 100,
        auto: true,
      },
      {
        label: "Customer Rating",
        value: `${avgRating}★`,
        rawValue: avgRating,
        auto: true,
        totalReviews,
      },
    ];

    return successResponse({
      stats,
      meta: {
        usersCount,
        fabricsCount,
        handcraftedCount,
        avgRating,
        totalReviews,
      },
    });
  } catch (error) {
    console.error("Brand stats error:", error);
    return errorResponse(error.message, 500);
  }
}
