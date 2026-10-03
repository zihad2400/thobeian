require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

// ================================================================
// MAPPING: Old Unsplash URL → New Local Path
// ================================================================
const IMAGE_MAPPING = {
  // Thobe product images
  "photo-1594736797933-d0501ba2fe65":
    "/images/products/thobe/premium-signature-thobe.jpg",
  "photo-1610030469983-98e550d6193c":
    "/images/products/thobe/classic-saudi-thobe.jpg",
  "photo-1622470953794-aa9c70b0fb9d":
    "/images/products/panjabi/premium-embroidered-panjabi.jpg",
  "photo-1528459801416-a9e53bbf4e17":
    "/images/products/panjabi/band-collar-panjabi.jpg",
  "photo-1558769132-cb1aea458c5e":
    "/images/products/thobe/linen-summer-thobe.jpg",
};

// Specific slug → image mapping (more precise)
const SLUG_IMAGE_MAP = {
  "premium-signature-thobe": {
    image: "/images/products/thobe/premium-signature-thobe.jpg",
    hover: "/images/products/thobe/premium-signature-thobe-hover.jpg",
  },
  "classic-saudi-thobe": {
    image: "/images/products/thobe/classic-saudi-thobe.jpg",
    hover: "/images/products/thobe/classic-saudi-thobe-hover.jpg",
  },
  "emirati-style-thobe": {
    image: "/images/products/thobe/emirati-style-thobe.jpg",
    hover: "/images/products/thobe/emirati-style-thobe-hover.jpg",
  },
  "linen-summer-thobe": {
    image: "/images/products/thobe/linen-summer-thobe.jpg",
    hover: "/images/products/thobe/linen-summer-thobe-hover.jpg",
  },
  "royal-black-thobe": {
    image: "/images/products/thobe/royal-black-thobe.jpg",
    hover: "/images/products/thobe/royal-black-thobe-hover.jpg",
  },
  "moroccan-style-thobe": {
    image: "/images/products/thobe/moroccan-style-thobe.jpg",
    hover: "/images/products/thobe/moroccan-style-thobe-hover.jpg",
  },
  "premium-embroidered-panjabi": {
    image: "/images/products/panjabi/premium-embroidered-panjabi.jpg",
    hover: "/images/products/panjabi/premium-embroidered-panjabi-hover.jpg",
  },
  "band-collar-panjabi": {
    image: "/images/products/panjabi/band-collar-panjabi.jpg",
    hover: "/images/products/panjabi/band-collar-panjabi-hover.jpg",
  },
};

// Category slug → image
const CATEGORY_IMAGE_MAP = {
  thobe: "/images/categories/thobe.jpg",
  panjabi: "/images/categories/panjabi.jpg",
  fabrics: "/images/categories/fabrics.jpg",
  "custom-thobe": "/images/categories/custom-thobe.jpg",
};

// Homepage images
const HOME_IMAGES = {
  hero: "/images/home/hero-thobe.jpg",
  brandStory: "/images/home/brand-story.jpg",
  customThobe: "/images/home/custom-thobe.jpg",
};

// Replace function - detect old URL and map to new
function replaceUrl(oldUrl) {
  if (!oldUrl) return oldUrl;
  if (oldUrl.startsWith("/images/")) return oldUrl; // already local
  if (oldUrl.startsWith("http://localhost")) return oldUrl;

  // Try to find unsplash photo ID
  for (const [photoId, newPath] of Object.entries(IMAGE_MAPPING)) {
    if (oldUrl.includes(photoId)) {
      return newPath;
    }
  }

  // Fallback
  return "/images/placeholder.jpg";
}

async function updateAll() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("═══════════════════════════════════════");
    console.log("🖼️  IMAGE URL UPDATE");
    console.log("═══════════════════════════════════════");
    console.log("");

    const db = mongoose.connection.db;

    // ===== 1. Products =====
    console.log("📦 Updating Products...");
    const products = await db.collection("products").find({}).toArray();
    let prodCount = 0;
    for (const p of products) {
      const map = SLUG_IMAGE_MAP[p.slug];
      let updated = false;

      if (map) {
        p.images = [map.image];
        p.hoverImage = map.hover;
        updated = true;
      } else {
        // generic replace
        p.images = (p.images || []).map(replaceUrl);
        if (p.hoverImage) p.hoverImage = replaceUrl(p.hoverImage);
        updated = true;
      }

      if (updated) {
        await db.collection("products").updateOne(
          { _id: p._id },
          {
            $set: {
              images: p.images,
              hoverImage: p.hoverImage,
              updatedAt: new Date(),
            },
          }
        );
        prodCount++;
        console.log(`  ✅ ${p.name}`);
      }
    }
    console.log(`📊 Products updated: ${prodCount}/${products.length}`);
    console.log("");

    // ===== 2. Categories =====
    console.log("📁 Updating Categories...");
    const categories = await db.collection("categories").find({}).toArray();
    let catCount = 0;
    for (const c of categories) {
      const newImage = CATEGORY_IMAGE_MAP[c.slug] || replaceUrl(c.image);
      if (c.image !== newImage) {
        await db.collection("categories").updateOne(
          { _id: c._id },
          {
            $set: {
              image: newImage,
              bannerImage: newImage,
              updatedAt: new Date(),
            },
          }
        );
        catCount++;
        console.log(`  ✅ ${c.name} → ${newImage}`);
      }
    }
    console.log(`📊 Categories updated: ${catCount}/${categories.length}`);
    console.log("");

    // ===== 3. Collections =====
    console.log("🎨 Updating Collections...");
    const collections = await db.collection("collections").find({}).toArray();
    let collCount = 0;
    for (const c of collections) {
      const newImage = replaceUrl(c.image);
      if (c.image !== newImage) {
        await db.collection("collections").updateOne(
          { _id: c._id },
          {
            $set: {
              image: newImage,
              bannerImage: newImage,
              updatedAt: new Date(),
            },
          }
        );
        collCount++;
        console.log(`  ✅ ${c.name}`);
      }
    }
    console.log(`📊 Collections updated: ${collCount}/${collections.length}`);
    console.log("");

    // ===== 4. Testimonials =====
    console.log("💬 Updating Testimonials...");
    const testimonials = await db.collection("testimonials").find({}).toArray();
    let testCount = 0;
    for (const t of testimonials) {
      const newImage = replaceUrl(t.productImage);
      if (t.productImage !== newImage) {
        await db.collection("testimonials").updateOne(
          { _id: t._id },
          {
            $set: {
              productImage: newImage,
              updatedAt: new Date(),
            },
          }
        );
        testCount++;
        console.log(`  ✅ ${t.name}`);
      }
    }
    console.log(`📊 Testimonials updated: ${testCount}/${testimonials.length}`);
    console.log("");

    console.log("═══════════════════════════════════════");
    console.log("✅ ALL UPDATES COMPLETE");
    console.log("═══════════════════════════════════════");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

updateAll();
