require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function update() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
    console.log("");

    const db = mongoose.connection.db;

    const contactInfo = {
      email: "thobeianofficial@gmail.com",
      phone: "+880 1350-888080",
      whatsapp: "8801350888080",
      address: "West Agargon, Sher-e-Bangla Nagar, Dhaka-1207, Bangladesh",
    };

    const result = await db.collection("sitesettings").updateOne(
      {},
      {
        $set: {
          "contact.email": contactInfo.email,
          "contact.phone": contactInfo.phone,
          "contact.whatsapp": contactInfo.whatsapp,
          "contact.address": contactInfo.address,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log("═══════════════════════════════════════");
    console.log("✅ CONTACT INFO UPDATED");
    console.log("═══════════════════════════════════════");
    console.log("");
    console.log("📧 Email:    ", contactInfo.email);
    console.log("📱 Phone:    ", contactInfo.phone);
    console.log("💬 WhatsApp: ", contactInfo.whatsapp);
    console.log("📍 Location: ", contactInfo.address);
    console.log("");
    console.log("═══════════════════════════════════════");

    // Verify
    const settings = await db.collection("sitesettings").findOne({});
    console.log("");
    console.log("📊 Verification:");
    console.log("  Email:   ", settings.contact?.email);
    console.log("  Phone:   ", settings.contact?.phone);
    console.log("  WhatsApp:", settings.contact?.whatsapp);
    console.log("  Address: ", settings.contact?.address);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

update();
