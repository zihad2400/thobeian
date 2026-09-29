require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function insertReview() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;

    const product = await db
      .collection("products")
      .findOne({ slug: "premium-signature-thobe" });
    const user = await db.collection("users").findOne({});

    if (!product || !user) {
      console.log("❌ Missing product or user");
      console.log("Product:", product ? "found" : "missing");
      console.log("User:", user ? "found" : "missing");
      process.exit(1);
    }

    const result = await db.collection("productreviews").insertOne({
      product: product._id,
      user: user._id,
      rating: 5,
      title: "Excellent Quality",
      comment:
        "Amazing fabric and perfect fit. Highly recommended! The craftsmanship is outstanding.",
      images: [],
      isVerifiedPurchase: true,
      status: "approved",
      helpfulCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    });

    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("✅ TEST REVIEW INSERTED");
    console.log("═══════════════════════════════════════");
    console.log("   ID:", result.insertedId.toString());
    console.log("   Product:", product.name);
    console.log("   User:", user.name);
    console.log("   Rating: 5 ★");
    console.log("   Status: approved");
    console.log("═══════════════════════════════════════");

    const count = await db.collection("productreviews").countDocuments();
    console.log("");
    console.log("📝 Total reviews:", count);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

insertReview();
