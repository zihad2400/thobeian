require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const users = await db.collection("users").find({}).toArray();
  console.log("👥 Users:");
  users.forEach(u => {
    console.log(`  - ${u.email} | role: ${u.role}`);
  });
  await mongoose.disconnect();
  process.exit(0);
});
