require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
    console.log("");

    const db = mongoose.connection.db;
    const email = process.argv[2] || "samsu@gmail.com";
    const newPassword = process.argv[3] || "admin123";

    if (!email || !newPassword) {
      console.log("❌ Usage: node scripts/reset-admin-password.js email@example.com newPassword");
      process.exit(1);
    }

    if (newPassword.length < 6) {
      console.log("❌ Password must be at least 6 characters");
      process.exit(1);
    }

    // Check user exists
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      console.log("");
      console.log("Available users:");
      const users = await db.collection("users").find({}).toArray();
      users.forEach((u) => console.log("  -", u.email, "| role:", u.role));
      process.exit(1);
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          passwordHash,
          updatedAt: new Date(),
        },
      }
    );

    console.log("═══════════════════════════════════════");
    console.log("✅ PASSWORD RESET SUCCESSFUL");
    console.log("═══════════════════════════════════════");
    console.log("");
    console.log("   Email:    ", email);
    console.log("   Name:     ", user.name);
    console.log("   Role:     ", user.role);
    console.log("   New Pass: ", newPassword);
    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("");
    console.log("🎯 Now login at: http://localhost:3000/login");
    console.log("");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

resetPassword();
