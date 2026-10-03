require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function createReviews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
    console.log("");

    const db = mongoose.connection.db;

    // Get all test users
    const users = await db.collection("users")
      .find({ email: { $regex: "@test.com$" } })
      .toArray();

    // Get all products
    const products = await db.collection("products").find({}).toArray();

    if (users.length === 0 || products.length === 0) {
      console.log("❌ Need users and products");
      process.exit(1);
    }

    const reviews = [
      {
        rating: 5,
        title: "Absolutely stunning quality!",
        comment: "The fabric feels premium and the fit is perfect. The craftsmanship is outstanding. Will definitely order again!",
      },
      {
        rating: 5,
        title: "Beyond expectations",
        comment: "Ordered a custom thobe for Eid. The measurement process was simple and the result was beyond my expectations. Highly recommended!",
      },
      {
        rating: 5,
        title: "Best Islamic fashion brand",
        comment: "Best Islamic fashion brand in Bangladesh. Premium materials, fast delivery, excellent customer service. 5 stars!",
      },
      {
        rating: 4,
        title: "Great quality products",
        comment: "Great quality products. The panjabi I ordered fit perfectly. Delivery could be slightly faster but overall very satisfied.",
      },
      {
        rating: 5,
        title: "Perfect fit and finish",
        comment: "The craftsmanship is outstanding. Every detail is perfectly done. Worth every taka spent. Will order more soon.",
      },
      {
        rating: 5,
        title: "Wedding special!",
        comment: "Ordered for my brother's wedding. Received so many compliments. THOBEIAN never disappoints! Perfect for special occasions.",
      },
      {
        rating: 5,
        title: "Premium quality fabric",
        comment: "The fabric quality is exceptional. Very comfortable to wear all day. The stitching is neat and professional.",
      },
      {
        rating: 4,
        title: "Very nice, recommended",
        comment: "Nice design and good quality. Fits well. Would recommend to friends and family. Keep up the good work!",
      },
      {
        rating: 5,
        title: "Sunnah in style — perfect!",
        comment: "Love how this brand combines tradition with modern elegance. The thobe I received is exactly as described. Alhamdulillah!",
      },
      {
        rating: 5,
        title: "Fast delivery, amazing product",
        comment: "Ordered on Monday, got it on Wednesday. The product is amazing and exactly what I wanted. Highly appreciate the service.",
      },
    ];

    let created = 0;
    let skipped = 0;

    for (let i = 0; i < users.length && i < reviews.length; i++) {
      const user = users[i];
      const review = reviews[i];
      const product = products[i % products.length];

      // Check if user already reviewed this product
      const exists = await db.collection("productreviews").findOne({
        user: user._id,
        product: product._id,
      });

      if (exists) {
        console.log(`⏭️  Review already exists: ${user.name}`);
        skipped++;
        continue;
      }

      await db.collection("productreviews").insertOne({
        product: product._id,
        user: user._id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        images: [],
        isVerifiedPurchase: true,
        status: "approved", // Auto-approved for testing
        helpfulCount: Math.floor(Math.random() * 30),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random last 30 days
        updatedAt: new Date(),
        __v: 0,
      });

      console.log(`✅ Review by ${user.name} → ${product.name} (${review.rating}★)`);
      created++;
    }

    console.log("");
    console.log("═══════════════════════════════════════");
    console.log(`✅ Created ${created} reviews`);
    console.log(`⏭️  Skipped ${skipped} (already exist)`);
    console.log(`📊 Total reviews: ${await db.collection("productreviews").countDocuments()}`);
    console.log("═══════════════════════════════════════");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createReviews();
