require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function findEmpty() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    console.log("🔍 Searching for empty images...\n");

    const products = await db.collection("products").find({}).toArray();
    products.forEach((p) => {
      if (!p.images?.[0]) {
        console.log("❌ Product missing image:", p.name, "| slug:", p.slug);
      }
      if (!p.hoverImage) {
        console.log("⚠️  Product missing hover:", p.name);
      }
    });

    const cats = await db.collection("categories").find({}).toArray();
    cats.forEach((c) => {
      if (!c.image) {
        console.log("❌ Category missing image:", c.name, "| slug:", c.slug);
      }
    });

    const cols = await db.collection("collections").find({}).toArray();
    cols.forEach((c) => {
      if (!c.image) {
        console.log("❌ Collection missing image:", c.name);
      }
    });

    const tests = await db.collection("testimonials").find({}).toArray();
    tests.forEach((t) => {
      if (!t.productImage) {
        console.log("❌ Testimonial missing image:", t.name);
      }
    });

    console.log("\n✅ Done");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

findEmpty();
