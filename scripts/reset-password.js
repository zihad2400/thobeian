require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;
    const email = process.argv[2];
    const newPassword = process.argv[3];

    if (!email || !newPassword) {
      console.log("❌ Usage: node scripts/reset-password.js email@example.com NewPassword123");
      process.exit(1);
    }

    if (newPassword.length < 6) {
      console.log("❌ Password must be at least 6 characters");
      process.exit(1);
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update user
    const result = await db
      .collection("users")
      .updateOne({ email }, { $set: { passwordHash } });

    if (result.matchedCount === 0) {
      console.log("❌ User not found:", email);
      process.exit(1);
    }

    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("✅ PASSWORD RESET SUCCESSFUL");
    console.log("═══════════════════════════════════════");
    console.log("   Email:", email);
    console.log("   New Password:", newPassword);
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
