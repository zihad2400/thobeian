require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function createUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
    console.log("");

    const db = mongoose.connection.db;
    const passwordHash = await bcrypt.hash("test123", 12);

    const users = [
      { name: "Ahmed Rahman", email: "ahmed@test.com", city: "Dhaka", phone: "01711111111" },
      { name: "Mohammad Hasan", email: "hasan@test.com", city: "Chittagong", phone: "01722222222" },
      { name: "Rafiq Islam", email: "rafiq@test.com", city: "Sylhet", phone: "01733333333" },
      { name: "Karim Uddin", email: "karim@test.com", city: "Rajshahi", phone: "01744444444" },
      { name: "Sabbir Ahmed", email: "sabbir@test.com", city: "Khulna", phone: "01755555555" },
      { name: "Naeem Islam", email: "naeem@test.com", city: "Barisal", phone: "01766666666" },
      { name: "Tanvir Hossain", email: "tanvir@test.com", city: "Rangpur", phone: "01777777777" },
      { name: "Imran Khan", email: "imran@test.com", city: "Mymensingh", phone: "01788888888" },
      { name: "Faisal Mahmud", email: "faisal@test.com", city: "Comilla", phone: "01799999999" },
      { name: "Shakib Al Hasan", email: "shakib@test.com", city: "Narayanganj", phone: "01700000000" },
    ];

    let created = 0;
    for (const u of users) {
      const exists = await db.collection("users").findOne({ email: u.email });
      if (exists) {
        console.log(`⏭️  Already exists: ${u.name}`);
        continue;
      }

      await db.collection("users").insertOne({
        ...u,
        passwordHash,
        role: "customer",
        addresses: [],
        measurementProfiles: [],
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      });

      console.log(`✅ Created: ${u.name} (${u.email})`);
      created++;
    }

    console.log("");
    console.log("═══════════════════════════════════════");
    console.log(`✅ Created ${created} new users`);
    console.log(`📊 Total: ${await db.collection("users").countDocuments()} users`);
    console.log("═══════════════════════════════════════");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createUsers();
