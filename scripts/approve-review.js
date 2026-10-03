require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function approve() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const result = await db.collection("productreviews").updateMany(
    { status: "pending" },
    { $set: { status: "approved", updatedAt: new Date() } }
  );

  console.log("═══════════════════════════════════════");
  console.log("✅ APPROVED:", result.modifiedCount, "reviews");
  console.log("═══════════════════════════════════════");
  console.log("");
  console.log("  👉 Refresh homepage: SHOULD show now!");
  console.log("  👉 Refresh product page: SHOULD show!");
  console.log("═══════════════════════════════════════");

  await mongoose.disconnect();
  process.exit(0);
}

approve();
