// ================================================================
// THOBEIAN — Database Seed Script
// Run: node scripts/seed.js
// ================================================================

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI .env.local এ নেই");
  process.exit(1);
}

// ================================================================
// Inline Models (script standalone চালানোর জন্য)
// ================================================================

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    description: String,
    image: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    type: String,
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    showInMenu: { type: Boolean, default: true },
    seo: Object,
  },
  { timestamps: true }
);

const CollectionSchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    description: String,
    image: String,
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FabricSchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    description: String,
    origin: String,
    weight: String,
    texture: String,
    season: [String],
    breathability: String,
    images: [String],
    priceModifier: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    sku: String,
    description: String,
    shortDescription: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
    fabric: { type: mongoose.Schema.Types.ObjectId, ref: "Fabric" },
    images: [String],
    hoverImage: String,
    video: String,
    price: Number,
    compareAtPrice: Number,
    costPrice: Number,
    variants: [Object],
    totalStock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    colors: [String],
    sizes: [String],
    tags: [String],
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    status: String,
    seo: Object,
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Collection =
  mongoose.models.Collection || mongoose.model("Collection", CollectionSchema);
const Fabric = mongoose.models.Fabric || mongoose.model("Fabric", FabricSchema);
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

// ================================================================
// Seed Data
// ================================================================

const UNSPLASH = {
  thobe1:
    "",
  thobe2:
    "",
  panjabi1:
    "",
  fabric1:
    "",
  custom1:
    "",
};

async function seed() {
  try {
    console.log("🔌 MongoDB connecting...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected");

    // ============ Clear old data ============
    console.log("🧹 Clearing old data...");
    await Category.deleteMany({});
    await Collection.deleteMany({});
    await Fabric.deleteMany({});
    await Product.deleteMany({});

    // ============ Categories ============
    console.log("📁 Creating categories...");
    const categories = await Category.insertMany([
      {
        name: "Thobe",
        slug: "thobe",
        description: "Premium Islamic Thobes",
        image: UNSPLASH.thobe1,
        type: "thobe",
        sortOrder: 1,
      },
      {
        name: "Jubba",
        slug: "jubba",
        description: "Premium Jubbas",
        image: UNSPLASH.thobe2,
        type: "jubba",
        sortOrder: 2,
      },
      {
        name: "Panjabi",
        slug: "panjabi",
        description: "Premium Panjabis",
        image: UNSPLASH.panjabi1,
        type: "panjabi",
        sortOrder: 3,
      },
      {
        name: "Fabrics",
        slug: "fabrics",
        description: "Premium Fabrics",
        image: UNSPLASH.fabric1,
        type: "fabric",
        sortOrder: 4,
      },
    ]);

    // ============ Subcategories (Thobe) ============
    const thobeId = categories[0]._id;
    await Category.insertMany([
      {
        name: "Premium Panjabi",
        slug: "premium-panjabi",
        parent: thobeId,
        type: "thobe",
      },
      {
        name: "Classic Panjabi",
        slug: "classic-panjabi",
        parent: thobeId,
        type: "thobe",
      },
      {
        name: "Pakistani Panjabi",
        slug: "pakistani-panjabi",
        parent: thobeId,
        type: "thobe",
      },
      {
        name: "Band Collar",
        slug: "band-collar",
        parent: thobeId,
        type: "thobe",
      },
    ]);

    // ============ Collections ============
    console.log("🎨 Creating collections...");
    const collections = await Collection.insertMany([
      {
        name: "Eid Collection",
        slug: "eid-collection",
        description: "Premium Eid Collection",
        image: UNSPLASH.thobe1,
        sortOrder: 1,
      },
      {
        name: "Ramadan Collection",
        slug: "ramadan-collection",
        description: "Ramadan Special",
        image: UNSPLASH.thobe2,
        sortOrder: 2,
      },
      {
        name: "Premium Collection",
        slug: "premium-collection",
        description: "Luxury Premium Line",
        image: UNSPLASH.custom1,
        sortOrder: 3,
      },
    ]);

    // ============ Fabrics ============
    console.log("🧵 Creating fabrics...");
    const fabrics = await Fabric.insertMany([
      {
        name: "Cotton",
        slug: "cotton",
        description: "Soft breathable cotton",
        origin: "Bangladesh",
        texture: "Smooth",
        season: ["Summer", "All"],
        breathability: "High",
        priceModifier: 0,
      },
      {
        name: "Premium Cotton",
        slug: "premium-cotton",
        description: "High-end premium cotton",
        origin: "Egypt",
        texture: "Very Smooth",
        season: ["All"],
        breathability: "High",
        priceModifier: 500,
      },
      {
        name: "Linen",
        slug: "linen",
        description: "Cool premium linen",
        origin: "Ireland",
        texture: "Textured",
        season: ["Summer"],
        breathability: "Very High",
        priceModifier: 800,
      },
      {
        name: "Pakistani Fabric",
        slug: "pakistani-fabric",
        description: "Premium Pakistani fabric",
        origin: "Pakistan",
        texture: "Smooth",
        season: ["All"],
        breathability: "Medium",
        priceModifier: 600,
      },
      {
        name: "Turkish Fabric",
        slug: "turkish-fabric",
        description: "Luxury Turkish blend",
        origin: "Turkey",
        texture: "Luxurious",
        season: ["Winter", "All"],
        breathability: "Medium",
        priceModifier: 1200,
      },
    ]);

    // ============ Products ============
    console.log("👕 Creating products...");
    const products = [
      {
        name: "Premium Signature Thobe",
        slug: "premium-signature-thobe",
        sku: "TH-PS-001",
        shortDescription: "Signature premium thobe",
        description: "Crafted with meticulous attention to detail.",
        category: thobeId,
        images: [UNSPLASH.thobe1, UNSPLASH.thobe2],
        hoverImage: UNSPLASH.thobe2,
        price: 5490,
        compareAtPrice: 6200,
        totalStock: 45,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Off White", "Black"],
        tags: ["premium", "signature", "thobe"],
        featured: true,
        bestseller: true,
        newArrival: true,
        status: "published",
      },
      {
        name: "Classic Saudi Thobe",
        slug: "classic-saudi-thobe",
        sku: "TH-CS-002",
        shortDescription: "Traditional Saudi style",
        description: "Classic Saudi design with modern fit.",
        category: thobeId,
        images: [UNSPLASH.thobe2, UNSPLASH.thobe1],
        hoverImage: UNSPLASH.thobe1,
        price: 4290,
        compareAtPrice: 4900,
        totalStock: 30,
        sizes: ["M", "L", "XL"],
        colors: ["White", "Beige"],
        tags: ["saudi", "classic", "thobe"],
        featured: true,
        newArrival: true,
        status: "published",
      },
      {
        name: "Premium Embroidered Panjabi",
        slug: "premium-embroidered-panjabi",
        sku: "PJ-PE-003",
        shortDescription: "Luxury embroidered panjabi",
        description: "Hand-embroidered premium panjabi.",
        category: categories[2]._id,
        images: [UNSPLASH.panjabi1],
        hoverImage: UNSPLASH.fabric1,
        price: 3890,
        compareAtPrice: 4500,
        totalStock: 25,
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["Cream", "White", "Navy"],
        tags: ["panjabi", "embroidered", "premium"],
        featured: true,
        bestseller: true,
        status: "published",
      },
      {
        name: "Emirati Style Thobe",
        slug: "emirati-style-thobe",
        sku: "TH-EM-004",
        shortDescription: "Emirati style premium thobe",
        description: "Modern Emirati cut with luxury fabric.",
        category: thobeId,
        images: [UNSPLASH.fabric1],
        hoverImage: UNSPLASH.panjabi1,
        price: 6490,
        compareAtPrice: 7500,
        totalStock: 15,
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Off White"],
        tags: ["emirati", "thobe"],
        featured: true,
        bestseller: true,
        status: "published",
      },
      {
        name: "Linen Summer Jubba",
        slug: "linen-summer-jubba",
        sku: "JB-LS-005",
        shortDescription: "Breathable summer jubba",
        description: "Lightweight linen jubba for summer.",
        category: categories[1]._id,
        images: [UNSPLASH.custom1],
        hoverImage: UNSPLASH.thobe1,
        price: 3490,
        totalStock: 40,
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Grey"],
        tags: ["jubba", "linen", "summer"],
        newArrival: true,
        status: "published",
      },
      {
        name: "Royal Black Thobe",
        slug: "royal-black-thobe",
        sku: "TH-RB-006",
        shortDescription: "Premium black thobe",
        description: "Royal black premium thobe.",
        category: thobeId,
        images: [UNSPLASH.thobe2],
        hoverImage: UNSPLASH.thobe1,
        price: 5990,
        compareAtPrice: 6800,
        totalStock: 20,
        sizes: ["M", "L", "XL"],
        colors: ["Black"],
        tags: ["black", "royal", "thobe"],
        featured: true,
        status: "published",
      },
      {
        name: "Band Collar Panjabi",
        slug: "band-collar-panjabi",
        sku: "PJ-BC-007",
        shortDescription: "Classic band collar panjabi",
        description: "Elegant band collar design.",
        category: categories[2]._id,
        images: [UNSPLASH.panjabi1],
        hoverImage: UNSPLASH.fabric1,
        price: 2990,
        compareAtPrice: 3500,
        totalStock: 35,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Beige", "Navy"],
        tags: ["band-collar", "panjabi"],
        status: "published",
      },
      {
        name: "Moroccan Style Thobe",
        slug: "moroccan-style-thobe",
        sku: "TH-MR-008",
        shortDescription: "Moroccan style premium",
        description: "Authentic Moroccan design.",
        category: thobeId,
        images: [UNSPLASH.thobe1],
        hoverImage: UNSPLASH.thobe2,
        price: 5290,
        compareAtPrice: 5900,
        totalStock: 22,
        sizes: ["M", "L", "XL"],
        colors: ["White", "Sand"],
        tags: ["moroccan", "thobe"],
        bestseller: true,
        status: "published",
      },
    ];

    await Product.insertMany(products);

    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("✅ SEED COMPLETED SUCCESSFULLY");
    console.log("═══════════════════════════════════════");
    console.log(`📁 Categories:  ${categories.length} (main) + 4 (sub)`);
    console.log(`🎨 Collections: ${collections.length}`);
    console.log(`🧵 Fabrics:     ${fabrics.length}`);
    console.log(`👕 Products:    ${products.length}`);
    console.log("═══════════════════════════════════════");
    console.log("");

    await mongoose.disconnect();
    console.log("🔌 Disconnected");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seed();