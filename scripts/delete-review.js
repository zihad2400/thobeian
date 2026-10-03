require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function del() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const product = await db.collection("products").findOne({ slug: "premium-signature-thobe" });

  const result = await db
    .collection("productreviews")
    .deleteMany({ product: product._id });

  console.log("═══════════════════════════════════════");
  console.log("🗑️  DELETED:", result.deletedCount, "reviews");
  console.log("═══════════════════════════════════════");

  await mongoose.disconnect();
  process.exit(0);
}

del();
