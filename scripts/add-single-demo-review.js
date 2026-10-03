require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function add() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const user = await db.collection("users").findOne({ role: "admin" });
  const product = await db.collection("products").findOne({});

  if (!user || !product) {
    console.log("❌ Need admin user + product");
    process.exit(1);
  }

  const review = {
    product: product._id,
    user: user._id,
    rating: 5,
    title: "Outstanding Quality!",
    comment: "Absolutely stunning quality! The fabric feels premium and the fit is perfect. Highly recommended!",
    images: [],
    isVerifiedPurchase: true,
    status: "approved",
    helpfulCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  };

  await db.collection("productreviews").insertOne(review);

  console.log("═══════════════════════════════════════");
  console.log("✅ DEMO REVIEW ADDED");
  console.log("═══════════════════════════════════════");
  console.log("  Product:", product.name);
  console.log("  User:", user.name);
  console.log("  Rating: 5★");
  console.log("  Status: approved");
  console.log("");
  console.log("  👉 Refresh homepage → should appear!");
  console.log("═══════════════════════════════════════");

  await mongoose.disconnect();
  process.exit(0);
}

add();
