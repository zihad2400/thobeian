require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function setup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
    console.log("");

    const db = mongoose.connection.db;

    const content = {
      // ===== HERO SECTION =====
      hero: {
        badge: "PREMIUM ISLAMIC FASHION",
        headlines: [
          {
            line1: "Sunnah in",
            line2: "Style",
            active: true,
            order: 1,
          },
          {
            line1: "Elegance in",
            line2: "Every Thread",
            active: true,
            order: 2,
          },
          {
            line1: "Tradition",
            line2: "Redefined",
            active: true,
            order: 3,
          },
        ],
        autoRotate: true,
        rotateInterval: 5000, // 5 seconds
        description:
          "Premium Thobes & Panjabis — crafted for the modern gentleman.",
        primaryButton: {
          label: "Shop Collection",
          url: "/shop",
        },
        secondaryButton: {
          label: "Customize Your Thobe",
          url: "/custom-thobe",
        },
        image: "/images/home/hero-thobe.jpg",
        theme: {
          backgroundGradient: "from-[#F7F3EA] via-white to-[#FAF9F6]",
          accentColor: "#C8A96B",
        },
      },

      // ===== CATEGORY SECTION =====
      categorySection: {
        subtitle: "Shop by Category",
        title: "Explore Our Collections",
        description: "Discover premium Islamic fashion for every occasion",
        isActive: true,
      },

      // ===== FEATURED PRODUCTS =====
      featuredSection: {
        subtitle: "Handpicked For You",
        title: "Featured Products",
        description: "Our best designs selected for you",
        isActive: true,
      },

      // ===== CUSTOM THOBE CTA =====
      customThobeCTA: {
        badge: "DESIGNED BY YOU",
        title: "Create Your Own Thobe",
        description:
          "Choose fabric, color, collar, buttons, and measurements. We craft it just for you.",
        buttonText: "Customize Now",
        buttonUrl: "/custom-thobe",
        features: [
          "Choose from 10+ premium fabrics",
          "Select collar, placket, buttons & more",
          "Provide exact measurements",
          "Live 3D preview of your design",
        ],
        image: "/images/home/custom-thobe.jpg",
        isActive: true,
      },

      // ===== BRAND STORY =====
      brandStory: {
        subtitle: "OUR STORY",
        title: "Crafted with Purpose, Worn with Pride",
        description:
          "THOBEIAN was born from a simple vision — to bring premium Islamic fashion to the modern gentleman. Every thobe, jubba, and panjabi is crafted with meticulous attention to detail, honoring tradition while embracing contemporary elegance.",
        stats: [
          { label: "Happy Customers", value: "10K+", icon: "users" },
          { label: "Premium Fabrics", value: "50+", icon: "sparkles" },
          { label: "Handcrafted", value: "100%", icon: "award" },
          { label: "Customer Rating", value: "5★", icon: "star" },
        ],
        image: "/images/home/brand-story.jpg",
        isActive: true,
      },

      // ===== TESTIMONIALS =====
      testimonialsSection: {
        subtitle: "Testimonials",
        title: "Loved by Our Customers",
        description: "Real reviews from real customers",
        isActive: true,
      },

      // ===== FAQ =====
      faqSection: {
        subtitle: "Questions?",
        title: "Frequently Asked",
        description: "Everything you need to know",
        isActive: true,
      },

      // ===== THEME COLORS =====
      theme: {
        primary: "#C8A96B", // Gold
        secondary: "#1F1F1F", // Charcoal
        accent: "#D8C3A5", // Champagne
        background: "#F7F3EA", // Luxury cream
        textPrimary: "#1F1F1F",
        textSecondary: "#6B6B6B",
      },
    };

    await db.collection("sitesettings").updateOne(
      {},
      {
        $set: {
          homepageContent: content,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log("═══════════════════════════════════════");
    console.log("✅ DYNAMIC HOMEPAGE HEADLINES ADDED");
    console.log("═══════════════════════════════════════");
    console.log("");
    console.log("📢 Hero Headlines:");
    content.hero.headlines.forEach((h, i) => {
      console.log(`   ${i + 1}. "${h.line1} ${h.line2}"`);
    });
    console.log("");
    console.log("🔄 Auto-rotate:", content.hero.autoRotate ? "Yes" : "No");
    console.log("⏱️  Interval:   ", content.hero.interval, "ms");
    console.log("");
    console.log("📝 Sections:");
    console.log("   • Hero             ✓");
    console.log("   • Categories       ✓");
    console.log("   • Featured         ✓");
    console.log("   • Custom CTA       ✓");
    console.log("   • Brand Story      ✓");
    console.log("   • Testimonials     ✓");
    console.log("   • FAQ              ✓");
    console.log("");
    console.log("═══════════════════════════════════════");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

setup();
