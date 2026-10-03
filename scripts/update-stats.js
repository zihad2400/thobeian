require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function update() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;

    const stats = [
      { label: "Happy Customers", value: "10K+" },
      { label: "Premium Fabrics", value: "50+" },
      { label: "Handcrafted", value: "100%" },
      { label: "Customer Rating", value: "5★" },
    ];

    const result = await db.collection("sitesettings").updateOne(
      {},
      {
        $set: {
          "brandStoryStats": stats,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log("═══════════════════════════════════════");
    console.log("✅ BRAND STORY STATS UPDATED");
    console.log("═══════════════════════════════════════");
    console.log("");
    stats.forEach((s) => {
      console.log(`  ${s.value.padEnd(8)} ${s.label}`);
    });
    console.log("");
    console.log("═══════════════════════════════════════");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

update();
