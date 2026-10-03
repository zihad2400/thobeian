require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  console.log("═══════════════════════════════════════");
  console.log("📊 REVIEW STATUS CHECK");
  console.log("═══════════════════════════════════════");
  console.log("");

  // 1. Product Reviews
  const allReviews = await db.collection("productreviews").find({}).toArray();
  const approved = allReviews.filter((r) => r.status === "approved");
  const pending = allReviews.filter((r) => r.status === "pending");
  const rejected = allReviews.filter((r) => r.status === "rejected");

  console.log("📝 PRODUCT REVIEWS:");
  console.log(`  Total: ${allReviews.length}`);
  console.log(`  ✅ Approved: ${approved.length}`);
  console.log(`  ⏳ Pending: ${pending.length}`);
  console.log(`  ❌ Rejected: ${rejected.length}`);
  console.log("");

  // 2. Admin Testimonials
  const testimonials = await db.collection("testimonials").find({}).toArray();
  console.log("⭐ ADMIN TESTIMONIALS:");
  console.log(`  Total: ${testimonials.length}`);
  console.log("");

  // 3. Show approved reviews details
  if (approved.length > 0) {
    console.log("═══════════════════════════════════════");
    console.log("✅ APPROVED REVIEWS:");
    console.log("═══════════════════════════════════════");
    approved.forEach((r, i) => {
      console.log(`${i + 1}. Rating: ${r.rating}★`);
      console.log(`   Comment: ${r.comment?.slice(0, 50)}...`);
      console.log("");
    });
  }

  await mongoose.disconnect();
  process.exit(0);
}

check();
