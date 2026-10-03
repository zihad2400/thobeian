require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    console.log("═══════════════════════════════════════");
    console.log("📊 BRAND STATS CALCULATION");
    console.log("═══════════════════════════════════════");
    console.log("");

    // Happy Customers
    const usersCount = await db
      .collection("users")
      .countDocuments({ isActive: { $ne: false } });
    console.log("👥 Happy Customers:", usersCount);

    // Premium Fabrics
    const fabricsCount = await db
      .collection("fabrics")
      .countDocuments({ isActive: { $ne: false } });
    console.log("🧵 Premium Fabrics:", fabricsCount);

    // Handcrafted
    const handcraftedCount = await db
      .collection("products")
      .countDocuments({ status: "published" });
    console.log("✂️  Handcrafted Products:", handcraftedCount);

    // Rating
    const ratingData = await db
      .collection("productreviews")
      .aggregate([
        { $match: { status: "approved" } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const avgRating =
      ratingData.length > 0 && ratingData[0].avgRating
        ? Math.round(ratingData[0].avgRating * 10) / 10
        : 5.0;
    const totalReviews =
      ratingData.length > 0 ? ratingData[0].totalReviews : 0;

    console.log("⭐ Customer Rating:", avgRating + "★");
    console.log("   Based on:", totalReviews, "reviews");

    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("📊 DISPLAY VALUES");
    console.log("═══════════════════════════════════════");
    console.log("  Happy Customers: " + usersCount);
    console.log("  Premium Fabrics: " + fabricsCount + "+");
    console.log("  Handcrafted:     100%");
    console.log("  Customer Rating: " + avgRating + "★");
    console.log("═══════════════════════════════════════");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

verify();
