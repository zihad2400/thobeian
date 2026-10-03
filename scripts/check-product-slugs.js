require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const products = await db
    .collection("products")
    .find({})
    .project({ name: 1, slug: 1, status: 1 })
    .toArray();

  console.log("═══════════════════════════════════════");
  console.log("📦 ALL PRODUCTS — NAME + SLUG + STATUS");
  console.log("═══════════════════════════════════════");
  console.log("");

  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   Slug: ${p.slug}`);
    console.log(`   Status: ${p.status}`);
    console.log(`   URL: /product/${p.slug}`);
    console.log("");
  });

  console.log("═══════════════════════════════════════");
  console.log(`📊 Total: ${products.length} products`);
  console.log("═══════════════════════════════════════");

  await mongoose.disconnect();
  process.exit(0);
}

check();
