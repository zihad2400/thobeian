require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    console.log("═══════════════════════════════════════");
    console.log("📊 TEST DATA VERIFICATION");
    console.log("═══════════════════════════════════════");
    console.log("");

    // Users
    const users = await db.collection("users").countDocuments();
    const testUsers = await db.collection("users").countDocuments({
      email: { $regex: "@test.com$" },
    });
    console.log("👥 Users:");
    console.log(`   Total: ${users}`);
    console.log(`   Test:  ${testUsers}`);
    console.log("");

    // Reviews
    const totalReviews = await db.collection("productreviews").countDocuments();
    const approvedReviews = await db.collection("productreviews").countDocuments({
      status: "approved",
    });
    const pendingReviews = await db.collection("productreviews").countDocuments({
      status: "pending",
    });

    console.log("⭐ Reviews:");
    console.log(`   Total:    ${totalReviews}`);
    console.log(`   Approved: ${approvedReviews}`);
    console.log(`   Pending:  ${pendingReviews}`);
    console.log("");

    // Top 10 reviews
    const reviews = await db
      .collection("productreviews")
      .aggregate([
        { $match: { status: "approved" } },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "productData",
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    console.log("═══════════════════════════════════════");
    console.log("📝 TOP 10 REVIEWS:");
    console.log("═══════════════════════════════════════");

    reviews.forEach((r, i) => {
      const userName = r.userData?.[0]?.name || "Unknown";
      const productName = r.productData?.[0]?.name || "Unknown";
      console.log(`${i + 1}. ${userName} → ${productName}`);
      console.log(`   Rating: ${r.rating}★`);
      console.log(`   "${r.comment?.slice(0, 50)}..."`);
      console.log("");
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

verify();
