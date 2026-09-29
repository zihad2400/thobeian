require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;
    const email = process.argv[2];

    if (!email) {
      console.log("❌ Usage: node scripts/make-admin.js your@email.com");
      process.exit(1);
    }

    // Check user
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      console.log("");
      console.log("Available users:");
      const users = await db.collection("users").find({}).toArray();
      users.forEach((u) => console.log("  -", u.email, "| role:", u.role));
      process.exit(1);
    }

    // Update role
    await db
      .collection("users")
      .updateOne({ email }, { $set: { role: "admin" } });

    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("✅ ADMIN ACCESS GRANTED");
    console.log("═══════════════════════════════════════");
    console.log("   Email:", email);
    console.log("   Name:", user.name);
    console.log("   Role: customer → admin");
    console.log("═══════════════════════════════════════");
    console.log("");
    console.log("🎯 Now visit: http://localhost:3000/admin");
    console.log("");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

makeAdmin();
