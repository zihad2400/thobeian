require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function addPanjabiSubs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;

    let panjabiCat = await db
      .collection("categories")
      .findOne({ slug: "panjabi" });

    if (!panjabiCat) {
      console.log("📁 Creating Panjabi category");
      const result = await db.collection("categories").insertOne({
        name: "Panjabi",
        slug: "panjabi",
        type: "panjabi",
        parent: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      panjabiCat = { _id: result.insertedId };
    }

    const subs = [
      { name: "Premium Panjabi", slug: "panjabi-premium" },
      { name: "Classic Panjabi", slug: "panjabi-classic" },
      { name: "Pakistani Panjabi", slug: "panjabi-pakistani" },
      { name: "Band Collar", slug: "panjabi-band-collar" },
    ];

    for (const sub of subs) {
      await db.collection("categories").updateOne(
        { slug: sub.slug },
        {
          $set: {
            name: sub.name,
            slug: sub.slug,
            type: "panjabi",
            parent: panjabiCat._id,
            isActive: true,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    console.log("✅ Panjabi subcategories created:", subs.length);

    const all = await db
      .collection("categories")
      .find({ parent: panjabiCat._id })
      .toArray();

    all.forEach((c) => console.log("  -", c.name, "|", c.slug));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addPanjabiSubs();
