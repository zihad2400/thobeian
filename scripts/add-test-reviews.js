require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function add() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const products = await db.collection("products").find({}).toArray();
  const user = await db.collection("users").findOne({});

  if (!user) {
    console.log("❌ No user found");
    process.exit(1);
  }

  const ratings = [5, 4.5, 5, 4, 5, 4.5, 5, 4.8];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const rating = ratings[i % ratings.length];

    // Check existing
    const existing = await db
      .collection("productreviews")
      .findOne({ product: p._id, user: user._id });

    if (existing) continue;

    await db.collection("productreviews").insertOne({
      product: p._id,
      user: user._id,
      rating: Math.floor(rating),
      title: "Great product!",
      comment: "Very satisfied with the quality and fit.",
      status: "approved",
      isVerifiedPurchase: true,
      images: [],
      helpfulCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    });

    console.log(`✅ Review added: ${p.name} → ${Math.floor(rating)}★`);
  }

  console.log("");
  console.log("🔄 Now run: node scripts/update-all-ratings.js");

  await mongoose.disconnect();
  process.exit(0);
}

add();
