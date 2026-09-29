require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function addSubcategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;

    // Find Thobe parent category
    const thobeCat = await db.collection("categories").findOne({ slug: "thobe" });
    if (!thobeCat) {
      console.log("❌ Thobe category not found");
      process.exit(1);
    }

    const subcategories = [
      {
        name: "Premium Panjabi",
        slug: "premium-panjabi",
        description: "Our most premium panjabi collection",
      },
      {
        name: "Classic Panjabi",
        slug: "classic-panjabi",
        description: "Timeless classic designs",
      },
      {
        name: "Pakistani Panjabi",
        slug: "pakistani-panjabi",
        description: "Authentic Pakistani style",
      },
      {
        name: "Band Collar",
        slug: "band-collar",
        description: "Modern band collar design",
      },
    ];

    for (const sub of subcategories) {
      await db.collection("categories").updateOne(
        { slug: sub.slug },
        {
          $set: {
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            type: "thobe",
            parent: thobeCat._id,
            isActive: true,
            sortOrder: 1,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    console.log("✅ Subcategories created:", subcategories.length);

    // Verify
    const all = await db
      .collection("categories")
      .find({ parent: thobeCat._id })
      .toArray();

    console.log("📁 Thobe subcategories:", all.length);
    all.forEach((c) => console.log("  -", c.name, "|", c.slug));

    await mongoose.disconnect();
    console.log("🔌 Disconnected");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addSubcategories();
