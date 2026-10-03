require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function update() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const result = await db.collection("products").updateMany(
      {},
      { $set: { handcrafted: true } }
    );

    console.log("═══════════════════════════════════════");
    console.log("✅ HANDCRAFTED FIELD ADDED");
    console.log("═══════════════════════════════════════");
    console.log(`  Updated: ${result.modifiedCount} products`);
    console.log("═══════════════════════════════════════");

    const count = await db
      .collection("products")
      .countDocuments({ handcrafted: true });
    console.log(`  Total handcrafted: ${count}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

update();
