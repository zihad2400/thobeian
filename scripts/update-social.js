require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function update() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const socialData = {
    "social.facebook": "https://facebook.com/thobeian",
    "social.instagram": "https://instagram.com/thobeian",
    "social.youtube": "https://youtube.com/@thobeianofficial",
    "social.tiktok": "https://tiktok.com/@thobeian",
    "social.twitter": "https://twitter.com/thobeian",
    "social.linkedin": "https://linkedin.com/company/thobeian",
    updatedAt: new Date(),
  };

  const result = await db.collection("sitesettings").updateOne(
    {},
    { $set: socialData },
    { upsert: true }
  );

  console.log("═══════════════════════════════════════");
  console.log("✅ SOCIAL LINKS UPDATED");
  console.log("═══════════════════════════════════════");
  console.log("");
  console.log("📘 Facebook:   facebook.com/thobeian");
  console.log("📸 Instagram:  instagram.com/thobeian");
  console.log("▶️  YouTube:    youtube.com/@thobeianofficial");
  console.log("🎵 TikTok:     tiktok.com/@thobeian");
  console.log("🐦 Twitter:    twitter.com/thobeian");
  console.log("💼 LinkedIn:   linkedin.com/company/thobeian");
  console.log("");
  console.log("═══════════════════════════════════════");

  await mongoose.disconnect();
  process.exit(0);
}

update();
