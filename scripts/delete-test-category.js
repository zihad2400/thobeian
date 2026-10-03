require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function deleteTest() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const result = await db
      .collection("categories")
      .deleteOne({ slug: "test-category" });

    console.log("✅ Deleted:", result.deletedCount, "test category");

    // Verify
    const remaining = await db
      .collection("categories")
      .find({})
      .toArray();
    console.log("📁 Total categories now:", remaining.length);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

deleteTest();
