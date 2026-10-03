require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function clear() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // Clear old testimonials collection
  const tResult = await db.collection("testimonials").deleteMany({});
  console.log("🗑️  Deleted admin testimonials:", tResult.deletedCount);

  // Clear all reviews too (if needed)
  const rResult = await db.collection("productreviews").deleteMany({});
  console.log("🗑️  Deleted product reviews:", rResult.deletedCount);

  // Reset all product ratings
  const pResult = await db.collection("products").updateMany(
    {},
    { $set: { rating: 0, reviewCount: 0 } }
  );
  console.log("🔄 Reset product ratings:", pResult.modifiedCount);

  console.log("");
  console.log("═══════════════════════════════════════");
  console.log("✅ ALL CLEARED");
  console.log("═══════════════════════════════════════");
  console.log("  👉 Refresh homepage — NO testimonials should show");
  console.log("  👉 Add new reviews via admin to see them");
  console.log("═══════════════════════════════════════");

  await mongoose.disconnect();
  process.exit(0);
}

clear();
