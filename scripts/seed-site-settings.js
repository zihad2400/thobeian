require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;
    const coll = db.collection("sitesettings");

    const existing = await coll.findOne({});
    if (existing) {
      console.log("⚠️  Settings exist. Updating social links...");
      await coll.updateOne(
        {},
        {
          $set: {
            "social.facebook": "https://facebook.com/thobeian",
            "social.instagram": "https://instagram.com/thobeian",
            "social.youtube": "https://youtube.com/@thobeian",
            "social.tiktok": "https://tiktok.com/@thobeian",
            "social.twitter": "https://twitter.com/thobeian",
            "social.linkedin": "https://linkedin.com/company/thobeian",
            updatedAt: new Date(),
          },
        }
      );
      console.log("✅ Social links updated");
    } else {
      await coll.insertOne({
        brandName: "THOBEIAN",
        tagline: "Sunnah in Style",
        contact: {
          email: "hello@thobeian.com",
          phone: "+880 1XXX-XXXXXX",
          whatsapp: "+8801XXXXXXXXX",
          address: "Dhaka, Bangladesh",
        },
        social: {
          facebook: "https://facebook.com/thobeian",
          instagram: "https://instagram.com/thobeian",
          youtube: "https://youtube.com/@thobeian",
          tiktok: "https://tiktok.com/@thobeian",
          twitter: "https://twitter.com/thobeian",
          linkedin: "https://linkedin.com/company/thobeian",
        },
        shipping: {
          insideDhaka: 80,
          outsideDhaka: 130,
          express: 200,
          freeShippingAbove: 5000,
          codFee: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✅ Default settings created");
    }

    const result = await coll.findOne({});
    console.log("");
    console.log("Social Links:");
    Object.entries(result.social || {}).forEach(([k, v]) => {
      console.log(`  ${k}: ${v}`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seed();
