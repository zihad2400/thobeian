require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function seedTestimonials() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;
    const coll = db.collection("testimonials");

    // Clear existing
    await coll.deleteMany({ source: "seed" });
    console.log("🧹 Cleared existing seed testimonials");

    const testimonials = [
      {
        name: "Ahmed Rahman",
        city: "Dhaka",
        rating: 5,
        comment:
          "Absolutely stunning quality. The fabric feels premium and the fit is perfect. Will definitely order again!",
        avatar: "",
        productImage:
          "",
        productName: "Premium Signature Thobe",
        isFeatured: true,
        isActive: true,
        sortOrder: 1,
        source: "seed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mohammad Hasan",
        city: "Chittagong",
        rating: 5,
        comment:
          "Ordered a custom thobe for Eid. The measurement process was simple and the result was beyond expectations.",
        avatar: "",
        productImage:
          "",
        productName: "Custom Eid Thobe",
        isFeatured: true,
        isActive: true,
        sortOrder: 2,
        source: "seed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Rafiq Islam",
        city: "Sylhet",
        rating: 5,
        comment:
          "Best Islamic fashion brand in Bangladesh. Premium materials, fast delivery, excellent customer service.",
        avatar: "",
        productImage:
          "",
        productName: "Premium Panjabi",
        isFeatured: true,
        isActive: true,
        sortOrder: 3,
        source: "seed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Karim Uddin",
        city: "Rajshahi",
        rating: 4,
        comment:
          "Great quality products. The panjabi I ordered fit perfectly. Delivery could be slightly faster.",
        avatar: "",
        productImage:
          "",
        productName: "Classic Panjabi",
        isFeatured: true,
        isActive: true,
        sortOrder: 4,
        source: "seed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sabbir Ahmed",
        city: "Khulna",
        rating: 5,
        comment:
          "The craftsmanship is outstanding. Every detail is perfectly done. Worth every taka.",
        avatar: "",
        productImage:
          "",
        productName: "Luxury Thobe",
        isFeatured: true,
        isActive: true,
        sortOrder: 5,
        source: "seed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Naeem Islam",
        city: "Barisal",
        rating: 5,
        comment:
          "Ordered for my brother's wedding. Received so many compliments. THOBEIAN never disappoints!",
        avatar: "",
        productImage:
          "",
        productName: "Wedding Thobe",
        isFeatured: true,
        isActive: true,
        sortOrder: 6,
        source: "seed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await coll.insertMany(testimonials);
    console.log(`✅ Inserted ${testimonials.length} testimonials`);

    const total = await coll.countDocuments({ isActive: true });
    console.log(`📊 Total active testimonials: ${total}`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedTestimonials();
