require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function addFabricSubs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;

    // Find Fabrics parent category
    let fabricCat = await db
      .collection("categories")
      .findOne({ slug: "fabrics" });

    if (!fabricCat) {
      console.log("📁 Creating Fabrics category");
      const result = await db.collection("categories").insertOne({
        name: "Fabrics",
        slug: "fabrics",
        description: "Premium fabrics sourced from around the world",
        image:
          "",
        bannerImage:
          "",
        type: "fabric",
        parent: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      fabricCat = { _id: result.insertedId };
    }

    const fabricSubs = [
      {
        name: "Cotton",
        slug: "cotton",
        description:
          "Soft, breathable pure cotton fabric — perfect for everyday comfort in Bangladesh's climate.",
        image:
          "",
      },
      {
        name: "Premium Cotton",
        slug: "premium-cotton",
        description:
          "Premium Egyptian cotton with superior softness and durability.",
        image:
          "",
      },
      {
        name: "Linen",
        slug: "linen",
        description:
          "Pure Irish linen — naturally cooling, breathable, and luxuriously comfortable.",
        image:
          "",
      },
      {
        name: "Pakistani Fabric",
        slug: "pakistani-fabric",
        description:
          "Premium Pakistani blends with traditional craftsmanship and modern comfort.",
        image:
          "",
      },
      {
        name: "Turkish Fabric",
        slug: "turkish-fabric",
        description:
          "Luxury Turkish weaves with premium texture and elegant finish.",
        image:
          "",
      },
    ];

    for (const sub of fabricSubs) {
      await db.collection("categories").updateOne(
        { slug: sub.slug },
        {
          $set: {
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            image: sub.image,
            type: "fabric",
            parent: fabricCat._id,
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
      console.log("✅ Created:", sub.slug);
    }

    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("✅ Fabric subcategories created:", fabricSubs.length);
    console.log("═══════════════════════════════════════");

    // Verify all categories
    const all = await db.collection("categories").find({}).toArray();
    console.log("");
    console.log("📁 Total categories:", all.length);
    all.forEach((c) => {
      const parent = c.parent ? "child" : "parent";
      console.log(`  [${parent}] ${c.name} | ${c.slug}`);
    });

    await mongoose.disconnect();
    console.log("🔌 Disconnected");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addFabricSubs();
