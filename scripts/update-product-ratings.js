require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function updateRatings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
    console.log("");

    const db = mongoose.connection.db;
    const products = await db.collection("products").find({}).toArray();

    let updated = 0;

    for (const p of products) {
      const reviews = await db
        .collection("productreviews")
        .find({ product: p._id, status: "approved" })
        .toArray();

      let rating = 0;
      let reviewCount = 0;

      if (reviews.length > 0) {
        const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        rating = Math.round((total / reviews.length) * 10) / 10;
        reviewCount = reviews.length;
      }

      await db.collection("products").updateOne(
        { _id: p._id },
        { $set: { rating, reviewCount, updatedAt: new Date() } }
      );

      console.log(
        `✅ ${p.name.padEnd(35)} ${rating}★ (${reviewCount} reviews)`
      );
      updated++;
    }

    console.log("");
    console.log("═══════════════════════════════════════");
    console.log(`✅ Updated ${updated} products`);
    console.log("═══════════════════════════════════════");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

updateRatings();
