require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const users = await db.collection("users").find({}).limit(1).toArray();
  const products = await db.collection("products").find({}).limit(1).toArray();

  const user = users[0];
  const product = products[0];

  // Add a PENDING review
  const result = await db.collection("productreviews").insertOne({
    product: product._id,
    user: user._id,
    rating: 5,
    title: "Pending Test",
    comment: "This review is PENDING — should NOT show on website",
    images: [],
    isVerifiedPurchase: false,
    status: "pending",
    helpfulCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  });

  console.log("═══════════════════════════════════════");
  console.log("📝 PENDING REVIEW ADDED");
  console.log("═══════════════════════════════════════");
  console.log("  Review ID:", result.insertedId.toString());
  console.log("  Product:", product.name);
  console.log("  Status: pending");
  console.log("");
  console.log("  👉 Check homepage: should NOT show");
  console.log("  👉 Check product page: should NOT show");
  console.log("  👉 Check admin/reviews: should show in Pending tab");
  console.log("═══════════════════════════════════════");

  await mongoose.disconnect();
  process.exit(0);
}

test();
