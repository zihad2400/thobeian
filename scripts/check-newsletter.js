require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;

  const all = await db.collection("newsletters").find({}).toArray();
  console.log("📧 Total newsletters:", all.length);
  console.log("");
  
  all.forEach((s, i) => {
    console.log(`${i + 1}. ${s.email}`);
    console.log(`   Active: ${s.isActive}`);
    console.log(`   Source: ${s.source}`);
    console.log(`   Date: ${s.createdAt}`);
    console.log("");
  });

  await mongoose.disconnect();
  process.exit(0);
});
