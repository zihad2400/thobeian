require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function update() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    // Arguments: label1:value1 label2:value2 ...
    const args = process.argv.slice(2);

    let stats;
    if (args.length >= 4) {
      // Custom values from arguments
      stats = args.map((arg) => {
        const [label, value] = arg.split(":");
        return { label: label.trim(), value: value.trim() };
      });
    } else {
      // Default values
      stats = [
        { label: "Happy Customers", value: "10K+" },
        { label: "Premium Fabrics", value: "50+" },
        { label: "Handcrafted", value: "100%" },
        { label: "Customer Rating", value: "5★" },
      ];
    }

    await db.collection("sitesettings").updateOne(
      {},
      { $set: { brandStoryStats: stats, updatedAt: new Date() } },
      { upsert: true }
    );

    console.log("═══════════════════════════════════════");
    console.log("✅ BRAND STATS UPDATED");
    console.log("═══════════════════════════════════════");
    stats.forEach((s) => console.log(`  ${s.value.padEnd(8)} ${s.label}`));
    console.log("═══════════════════════════════════════");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

update();
