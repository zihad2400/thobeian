require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("═══════════════════════════════════════");
    console.log("🔍 IMAGE VERIFICATION");
    console.log("═══════════════════════════════════════");
    console.log("");

    const db = mongoose.connection.db;
    let externalCount = 0;
    let localCount = 0;
    let emptyCount = 0;

    const check = (url) => {
      if (!url) {
        emptyCount++;
        return;
      }
      if (typeof url !== "string") return;
      if (url.includes("unsplash.com") || url.includes("via.placeholder") || url.includes("res.cloudinary")) {
        externalCount++;
        console.log("  ❌ EXTERNAL:", url);
      } else if (url.startsWith("/images/")) {
        localCount++;
      } else {
        // Localhost or other
        console.log("  ⚠️  OTHER:", url);
      }
    };

    // Products
    console.log("📦 Products:");
    const products = await db.collection("products").find({}).toArray();
    products.forEach((p) => {
      console.log(`  - ${p.name}`);
      check(p.images?.[0]);
      check(p.hoverImage);
    });

    // Categories
    console.log("");
    console.log("📁 Categories:");
    const cats = await db.collection("categories").find({}).toArray();
    cats.forEach((c) => {
      check(c.image);
    });

    // Collections
    console.log("");
    console.log("🎨 Collections:");
    const cols = await db.collection("collections").find({}).toArray();
    cols.forEach((c) => {
      check(c.image);
    });

    // Testimonials
    console.log("");
    console.log("💬 Testimonials:");
    const tests = await db.collection("testimonials").find({}).toArray();
    tests.forEach((t) => {
      check(t.productImage);
    });

    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("📊 SUMMARY");
    console.log("═══════════════════════════════════════");
    console.log("✅ Local URLs:    ", localCount);
    console.log("❌ External URLs: ", externalCount);
    console.log("⚪ Empty:         ", emptyCount);
    console.log("═══════════════════════════════════════");

    if (externalCount === 0) {
      console.log("");
      console.log("🎉 SUCCESS! All images are local!");
    } else {
      console.log("");
      console.log("⚠️  Still need to update", externalCount, "external URLs");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

verify();
