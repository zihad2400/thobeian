require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function createTest() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;

    // Check existing
    const existing = await db
      .collection("categories")
      .findOne({ slug: "test-category" });

    if (existing) {
      console.log("⚠️ Already exists:", existing.name);
    } else {
      const result = await db.collection("categories").insertOne({
        name: "Test Category",
        slug: "test-category",
        description: "This is a test category",
        type: "thobe",
        parent: null,
        isActive: true,
        sortOrder: 99,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      });

      console.log("✅ Category created");
      console.log("   ID:", result.insertedId.toString());
    }

    const total = await db.collection("categories").countDocuments();
    console.log("📁 Total categories:", total);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createTest();
