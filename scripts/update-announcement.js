require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function update() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
    console.log("");

    const db = mongoose.connection.db;

    const announcement = {
      text: "FREE SHIPPING ON ORDERS ABOVE ৳5000 • EID COLLECTION NOW LIVE",
      link: "/collections/eid-collection",
      isActive: true,
      backgroundColor: "#1F1F1F",
      textColor: "#FFFFFF",
    };

    await db.collection("sitesettings").updateOne(
      {},
      {
        $set: {
          announcement,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log("═══════════════════════════════════════");
    console.log("✅ ANNOUNCEMENT BAR ADDED");
    console.log("═══════════════════════════════════════");
    console.log("");
    console.log("📢 Text:   ", announcement.text);
    console.log("🔗 Link:   ", announcement.link);
    console.log("✓  Active: ", announcement.isActive);
    console.log("🎨 BG:     ", announcement.backgroundColor);
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
