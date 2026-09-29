require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function updateCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;
    const categories = db.collection("categories");

    // ================================================================
    // Parent Category Updates
    // ================================================================
    const parentUpdates = [
      {
        slug: "thobe",
        data: {
          name: "Thobe",
          description:
            "Discover our premium collection of thobes — crafted from the finest fabrics with impeccable tailoring. Perfect for everyday elegance and special occasions.",
          image:
            "",
          bannerImage:
            "",
          type: "thobe",
          isActive: true,
        },
      },
      {
        slug: "panjabi",
        data: {
          name: "Panjabi",
          description:
            "Elegant panjabis for every occasion — from festive Eid celebrations to sophisticated everyday wear. Premium fabrics, modern cuts, timeless style.",
          image:
            "",
          bannerImage:
            "",
          type: "panjabi",
          isActive: true,
        },
      },
      {
        slug: "fabrics",
        data: {
          name: "Fabrics",
          description:
            "Premium fabrics sourced from around the world — Egyptian cotton, Irish linen, Pakistani blends, and Turkish weaves.",
          image:
            "",
          bannerImage:
            "",
          type: "fabric",
          isActive: true,
        },
      },
    ];

    // ================================================================
    // Subcategory Updates
    // ================================================================
    const subUpdates = [
      // Thobe subcategories
      {
        slug: "premium-panjabi",
        data: {
          name: "Premium Panjabi",
          description:
            "Our most exclusive panjabi collection — featuring handcrafted details, luxury fabrics, and impeccable finishing. For those who demand the very best.",
          image:
            "",
        },
      },
      {
        slug: "classic-panjabi",
        data: {
          name: "Classic Panjabi",
          description:
            "Timeless designs that never go out of style. Traditional craftsmanship meets contemporary comfort in our classic collection.",
          image:
            "",
        },
      },
      {
        slug: "pakistani-panjabi",
        data: {
          name: "Pakistani Panjabi",
          description:
            "Authentic Pakistani style with traditional embroidery and premium fabric. A fusion of heritage and modern elegance.",
          image:
            "",
        },
      },
      {
        slug: "band-collar",
        data: {
          name: "Band Collar",
          description:
            "Modern band collar design with a contemporary edge. Minimal, elegant, and effortlessly stylish for the modern man.",
          image:
            "",
        },
      },

      // Panjabi subcategories
      {
        slug: "panjabi-premium",
        data: {
          name: "Premium Panjabi",
          description:
            "Our most exclusive panjabi collection — luxury fabrics with handcrafted details.",
          image:
            "",
        },
      },
      {
        slug: "panjabi-classic",
        data: {
          name: "Classic Panjabi",
          description:
            "Timeless classic designs for every occasion.",
          image:
            "",
        },
      },
      {
        slug: "panjabi-pakistani",
        data: {
          name: "Pakistani Panjabi",
          description:
            "Authentic Pakistani style with premium craftsmanship.",
          image:
            "",
        },
      },
      {
        slug: "panjabi-band-collar",
        data: {
          name: "Band Collar",
          description:
            "Modern band collar panjabi designs.",
          image:
            "",
        },
      },

      // Fabric subcategories
      {
        slug: "cotton",
        data: {
          name: "Cotton",
          description:
            "Soft, breathable pure cotton fabric — perfect for everyday comfort in Bangladesh's climate.",
          image:
            "",
        },
      },
      {
        slug: "premium-cotton",
        data: {
          name: "Premium Cotton",
          description:
            "Premium Egyptian cotton with superior softness and durability.",
          image:
            "",
        },
      },
      {
        slug: "linen",
        data: {
          name: "Linen",
          description:
            "Pure Irish linen — naturally cooling, breathable, and luxuriously comfortable.",
          image:
            "",
        },
      },
      {
        slug: "pakistani-fabric",
        data: {
          name: "Pakistani Fabric",
          description:
            "Premium Pakistani blends with traditional craftsmanship and modern comfort.",
          image:
            "",
        },
      },
      {
        slug: "turkish-fabric",
        data: {
          name: "Turkish Fabric",
          description:
            "Luxury Turkish weaves with premium texture and elegant finish.",
          image:
            "",
        },
      },
    ];

    let parentCount = 0;
    let subCount = 0;

    // Update parents
    for (const item of parentUpdates) {
      const result = await categories.updateOne(
        { slug: item.slug },
        { $set: { ...item.data, updatedAt: new Date() } }
      );
      if (result.matchedCount > 0) {
        parentCount++;
        console.log("✅ Updated parent:", item.slug);
      }
    }

    // Update subcategories
    for (const item of subUpdates) {
      const result = await categories.updateOne(
        { slug: item.slug },
        { $set: { ...item.data, updatedAt: new Date() } }
      );
      if (result.matchedCount > 0) {
        subCount++;
        console.log("✅ Updated sub:", item.slug);
      } else {
        console.log("⚠️ Not found:", item.slug);
      }
    }

    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("✅ Parent categories updated:", parentCount);
    console.log("✅ Subcategories updated:", subCount);
    console.log("═══════════════════════════════════════");

    await mongoose.disconnect();
    console.log("🔌 Disconnected");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

updateCategories();
