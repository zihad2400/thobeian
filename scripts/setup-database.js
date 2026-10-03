require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

// ===== Safe Index Creator =====
async function safeCreateIndex(collection, keys, options = {}) {
  try {
    await collection.createIndex(keys, options);
    const keyStr = Object.keys(keys).join("+");
    console.log(`   ✅ ${keyStr}${options.unique ? " [unique]" : ""}`);
  } catch (error) {
    if (error.code === 85 || error.codeName === "IndexOptionsConflict" || error.message.includes("existing index")) {
      const keyStr = Object.keys(keys).join("+");
      console.log(`   ⚠️  ${keyStr} already exists (skipped)`);
    } else {
      throw error;
    }
  }
}

async function setup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
    console.log("");

    const db = mongoose.connection.db;

    console.log("═══════════════════════════════════════");
    console.log("🗄️  DATABASE STRUCTURE SETUP");
    console.log("═══════════════════════════════════════");
    console.log("");

    // ===== 1. USERS =====
    console.log("📁 1. users");
    const users = db.collection("users");
    await safeCreateIndex(users, { email: 1 }, { unique: true });
    await safeCreateIndex(users, { role: 1 });
    await safeCreateIndex(users, { isActive: 1 });
    await safeCreateIndex(users, { createdAt: -1 });
    console.log("");

    // ===== 2. PRODUCTS =====
    console.log("📁 2. products");
    const products = db.collection("products");
    await safeCreateIndex(products, { slug: 1 }, { unique: true });
    await safeCreateIndex(products, { category: 1, status: 1 });
    await safeCreateIndex(products, { featured: 1, status: 1 });
    await safeCreateIndex(products, { bestseller: 1 });
    await safeCreateIndex(products, { newArrival: 1 });
    await safeCreateIndex(products, { price: 1 });
    await safeCreateIndex(products, { rating: -1 });
    await safeCreateIndex(products, { status: 1 });
    await safeCreateIndex(
      products,
      { name: "text", description: "text", tags: "text" },
      { name: "product_text_search" }
    );
    console.log("");

    // ===== 3. CATEGORIES =====
    console.log("📁 3. categories");
    const categories = db.collection("categories");
    await safeCreateIndex(categories, { slug: 1 }, { unique: true });
    await safeCreateIndex(categories, { parent: 1 });
    await safeCreateIndex(categories, { type: 1, isActive: 1 });
    await safeCreateIndex(categories, { sortOrder: 1 });
    console.log("");

    // ===== 4. COLLECTIONS =====
    console.log("📁 4. collections");
    const collections = db.collection("collections");
    await safeCreateIndex(collections, { slug: 1 }, { unique: true });
    await safeCreateIndex(collections, { isActive: 1, sortOrder: 1 });
    console.log("");

    // ===== 5. FABRICS =====
    console.log("📁 5. fabrics");
    const fabrics = db.collection("fabrics");
    await safeCreateIndex(fabrics, { slug: 1 }, { unique: true });
    await safeCreateIndex(fabrics, { isActive: 1 });
    console.log("");

    // ===== 6. CARTS =====
    console.log("📁 6. carts");
    const carts = db.collection("carts");
    await safeCreateIndex(carts, { user: 1 }, { unique: true, sparse: true });
    await safeCreateIndex(carts, { sessionId: 1 }, { sparse: true });
    await safeCreateIndex(carts, { updatedAt: -1 });
    console.log("");

    // ===== 7. WISHLISTS =====
    console.log("📁 7. wishlists");
    const wishlists = db.collection("wishlists");
    await safeCreateIndex(wishlists, { user: 1 }, { unique: true });
    console.log("");

    // ===== 8. ORDERS =====
    console.log("📁 8. orders");
    const orders = db.collection("orders");
    await safeCreateIndex(orders, { orderNumber: 1 }, { unique: true });
    await safeCreateIndex(orders, { user: 1, createdAt: -1 });
    await safeCreateIndex(orders, { orderStatus: 1 });
    await safeCreateIndex(orders, { paymentStatus: 1 });
    await safeCreateIndex(orders, { paymentMethod: 1 });
    await safeCreateIndex(orders, { createdAt: -1 });
    await safeCreateIndex(orders, { "customerInfo.phone": 1 });
    console.log("");

    // ===== 9. PAYMENTS =====
    console.log("📁 9. payments");
    const payments = db.collection("payments");
    await safeCreateIndex(payments, { transactionId: 1 }, { unique: true, sparse: true });
    await safeCreateIndex(payments, { order: 1 });
    await safeCreateIndex(payments, { provider: 1, status: 1 });
    await safeCreateIndex(payments, { createdAt: -1 });
    console.log("");

    // ===== 10. COUPONS =====
    console.log("📁 10. coupons");
    const coupons = db.collection("coupons");
    await safeCreateIndex(coupons, { code: 1 }, { unique: true });
    await safeCreateIndex(coupons, { isActive: 1, startDate: 1, endDate: 1 });
    console.log("");

    // ===== 11. PRODUCT REVIEWS =====
    console.log("📁 11. productreviews");
    const reviews = db.collection("productreviews");
    await safeCreateIndex(reviews, { product: 1, status: 1 });
    await safeCreateIndex(reviews, { user: 1 });
    await safeCreateIndex(reviews, { rating: -1 });
    await safeCreateIndex(reviews, { createdAt: -1 });
    console.log("");

    // ===== 12. TESTIMONIALS =====
    console.log("📁 12. testimonials");
    const testimonials = db.collection("testimonials");
    await safeCreateIndex(testimonials, { isActive: 1, isFeatured: 1, sortOrder: 1 });
    await safeCreateIndex(testimonials, { createdAt: -1 });
    console.log("");

    // ===== 13. CUSTOM THOBE DESIGNS =====
    console.log("📁 13. customthobedesigns");
    const designs = db.collection("customthobedesigns");
    await safeCreateIndex(designs, { designId: 1 }, { unique: true });
    await safeCreateIndex(designs, { user: 1, createdAt: -1 });
    await safeCreateIndex(designs, { isOrdered: 1 });
    console.log("");

    // ===== 14. NAVIGATIONS =====
    console.log("📁 14. navigations");
    const navigations = db.collection("navigations");
    await safeCreateIndex(navigations, { name: 1, location: 1 }, { unique: true });
    await safeCreateIndex(navigations, { isActive: 1 });
    console.log("");

    // ===== 15. BANNERS =====
    console.log("📁 15. banners");
    const banners = db.collection("banners");
    await safeCreateIndex(banners, { position: 1, isActive: 1, sortOrder: 1 });
    console.log("");

    // ===== 16. FAQS =====
    console.log("📁 16. faqs");
    const faqs = db.collection("faqs");
    await safeCreateIndex(faqs, { isActive: 1, sortOrder: 1 });
    await safeCreateIndex(faqs, { category: 1 });
    console.log("");

    // ===== 17. NEWSLETTERS =====
    console.log("📁 17. newsletters");
    const newsletters = db.collection("newsletters");
    await safeCreateIndex(newsletters, { email: 1 }, { unique: true });
    await safeCreateIndex(newsletters, { isActive: 1 });
    await safeCreateIndex(newsletters, { createdAt: -1 });
    console.log("");

    // ===== 18. SITE SETTINGS =====
    console.log("📁 18. sitesettings");
    const sitesettings = db.collection("sitesettings");
    await safeCreateIndex(sitesettings, { createdAt: 1 });
    console.log("");

    // ===== SUMMARY =====
    console.log("═══════════════════════════════════════");
    console.log("✅ DATABASE STRUCTURE COMPLETE");
    console.log("═══════════════════════════════════════");
    console.log("");

    const allCollections = await db.listCollections().toArray();
    console.log(`📊 Total Collections: ${allCollections.length}`);
    console.log("");

    for (const coll of allCollections) {
      const count = await db.collection(coll.name).countDocuments();
      const indexes = await db.collection(coll.name).indexes();
      console.log(
        `   ${coll.name.padEnd(25)} ${count.toString().padStart(5)} docs, ${indexes.length} indexes`
      );
    }

    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("🎉 ALL INDEXES VERIFIED!");
    console.log("═══════════════════════════════════════");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

setup();
