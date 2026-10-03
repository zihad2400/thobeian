require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function clear() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    console.log("═══════════════════════════════════════");
    console.log("🗑️  DELETING ADMIN TESTIMONIALS");
    console.log("═══════════════════════════════════════");
    console.log("");

    // Show before
    const before = await db.collection("testimonials").find({}).toArray();
    console.log(`Found: ${before.length} testimonials`);
    before.forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.name} — ${t.comment?.slice(0, 40)}...`);
    });

    // Delete all
    const result = await db.collection("testimonials").deleteMany({});
    console.log("");
    console.log(`✅ Deleted: ${result.deletedCount} testimonials`);

    // Verify
    const after = await db.collection("testimonials").countDocuments();
    console.log(`📊 Remaining: ${after}`);

    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("🎯 NEXT STEPS");
    console.log("═══════════════════════════════════════");
    console.log("  1. Refresh homepage (Ctrl+Shift+R)");
    console.log("  2. Testimonials section should be HIDDEN");
    console.log("  3. Add new review via admin panel");
    console.log("  4. Approve → appears on homepage");
    console.log("═══════════════════════════════════════");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

clear();
