require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function analyze() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  console.log("═══════════════════════════════════════");
  console.log("📊 DATABASE ANALYSIS");
  console.log("═══════════════════════════════════════");
  console.log("");

  const collections = await db.listCollections().toArray();

  for (const coll of collections) {
    const count = await db.collection(coll.name).countDocuments();
    const sample = await db.collection(coll.name).findOne({});

    console.log(`📁 ${coll.name.toUpperCase()}`);
    console.log(`   Documents: ${count}`);
    console.log(`   Fields: ${sample ? Object.keys(sample).length : 0}`);
    if (sample) {
      console.log(`   Keys: ${Object.keys(sample).join(", ")}`);
    }
    console.log("");
  }

  console.log("═══════════════════════════════════════");
  console.log(`📊 Total Collections: ${collections.length}`);
  console.log("═══════════════════════════════════════");

  await mongoose.disconnect();
  process.exit(0);
}

analyze();
