import Link from "next/link";
import {
  Award,
  Users,
  Package,
  Heart,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Target,
  Eye,
  Check,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

export const metadata = {
  title: "About Us — Our Story & Values",
  description:
    "Learn about THOBEIAN — Bangladesh's premium Islamic fashion brand. Our story, our values, and our commitment to Sunnah-inspired elegance.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* ==================== HERO ==================== */}
      <section className="relative bg-background-luxury py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="heading-sub">Since 2020</p>
          <h1 className="font-serif text-5xl md:text-7xl text-charcoal mb-6 leading-tight">
            Crafted for the <br />
            <span className="text-gold">Modern Gentleman</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            THOBEIAN is Bangladesh's premier Islamic fashion house — where
            traditional elegance meets contemporary craftsmanship. Every thobe,
            panjabi, and fabric tells a story of devotion, quality, and pride.
          </p>
          <div className="divider-gold mt-10" />
        </div>
      </section>

      {/* ==================== OUR STORY ==================== */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
                alt="Our Story"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-gold/40 hidden lg:block" />
            </div>
            <div>
              <p className="heading-sub">Our Story</p>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
                A Vision Born from Faith
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  <strong className="text-charcoal">THOBEIAN</strong> was born
                  in 2020 from a simple yet powerful vision — to make premium
                  Islamic fashion accessible to every Muslim gentleman who
                  values both tradition and elegance.
                </p>
                <p>
                  What started as a small tailoring workshop in Dhaka has grown
                  into one of Bangladesh's most trusted Islamic fashion brands.
                  Today, we serve thousands of customers across the country —
                  from Dhaka to Sylhet, from Chittagong to Rajshahi — delivering
                  quality that speaks for itself.
                </p>
                <p>
                  Every piece we create is a labor of love. We don't just sell
                  clothing — we craft garments that honor the Sunnah, respect
                  tradition, and elevate your everyday elegance.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="border-l-2 border-gold pl-4">
                  <p className="font-serif text-3xl text-charcoal">2020</p>
                  <p className="text-xs uppercase tracking-widest text-text-muted mt-1">
                    Founded
                  </p>
                </div>
                <div className="border-l-2 border-gold pl-4">
                  <p className="font-serif text-3xl text-charcoal">Dhaka</p>
                  <p className="text-xs uppercase tracking-widest text-text-muted mt-1">
                    Made in Bangladesh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MISSION & VISION ==================== */}
      <section className="section-padding bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="heading-sub">Purpose</p>
            <h2 className="heading-section">Our Mission & Vision</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 border border-border hover:border-gold/40 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 text-gold mb-6">
                <Target size={28} />
              </div>
              <h3 className="font-serif text-2xl text-charcoal mb-4">
                Our Mission
              </h3>
              <p className="text-text-secondary leading-relaxed">
                To craft premium Islamic clothing that empowers Muslim men to
                embrace their identity with confidence and elegance. We aim to
                make high-quality thobes and panjabis accessible to every
                household in Bangladesh and beyond.
              </p>
            </div>

            <div className="bg-white p-10 border border-border hover:border-gold/40 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 text-gold mb-6">
                <Eye size={28} />
              </div>
              <h3 className="font-serif text-2xl text-charcoal mb-4">
                Our Vision
              </h3>
              <p className="text-text-secondary leading-relaxed">
                To become South Asia's most trusted Islamic fashion brand —
                known not just for our premium quality, but for our unwavering
                commitment to Islamic values, customer satisfaction, and
                craftsmanship excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="heading-sub">Why THOBEIAN</p>
            <h2 className="heading-section">Why Choose Us</h2>
            <p className="text-text-secondary max-w-2xl mx-auto mt-4">
              We're not just another clothing brand. Here's what makes THOBEIAN
              different.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Premium Quality",
                desc: "We source only the finest fabrics from Egypt, Ireland, Pakistan, and Turkey. Every stitch is a promise of excellence.",
              },
              {
                icon: Sparkles,
                title: "Handcrafted Elegance",
                desc: "Each garment is carefully tailored by experienced craftsmen who have mastered the art of Islamic fashion.",
              },
              {
                icon: Truck,
                title: "Fast Nationwide Delivery",
                desc: "Inside Dhaka within 1-2 days, outside Dhaka within 2-4 days. Express delivery available.",
              },
              {
                icon: ShieldCheck,
                title: "Secure Payment",
                desc: "Pay securely with bKash, Nagad, SSLCommerz, or choose Cash on Delivery for your convenience.",
              },
              {
                icon: RotateCcw,
                title: "Easy Returns",
                desc: "7-day hassle-free return policy. Not satisfied? We'll make it right.",
              },
              {
                icon: Heart,
                title: "Customer First",
                desc: "10,000+ satisfied customers across Bangladesh. We're committed to your happiness.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 border border-border hover:border-gold/40 hover:shadow-card transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/10 text-gold mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-serif text-xl text-charcoal mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="section-padding bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-medium mb-3">
              Our Numbers
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">
              By the Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Happy Customers", icon: Users },
              { value: "50+", label: "Premium Fabrics", icon: Sparkles },
              { value: "100%", label: "Handcrafted", icon: Award },
              { value: "5.0★", label: "Average Rating", icon: Star },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx}>
                  <Icon size={24} className="text-gold mx-auto mb-4" />
                  <p className="font-serif text-4xl md:text-5xl text-gold mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== OUR VALUES ==================== */}
      <section className="section-padding bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="heading-sub">What We Stand For</p>
            <h2 className="heading-section">Our Core Values</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Faith First",
                desc: "Every decision we make is guided by Islamic principles. We honor the Sunnah in everything we do.",
              },
              {
                title: "Uncompromising Quality",
                desc: "We never cut corners. From fabric to stitching to packaging — excellence is our standard.",
              },
              {
                title: "Honesty & Transparency",
                desc: "Clear pricing, honest product descriptions, no hidden charges. Trust is the foundation of our business.",
              },
              {
                title: "Customer Obsession",
                desc: "Your satisfaction is our success. We go above and beyond to make sure you love what you receive.",
              },
            ].map((value, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-gold text-white flex items-center justify-center">
                    <Check size={20} />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-charcoal mb-2">
                    {value.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FABRIC SOURCES ==================== */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="heading-sub">Sourced Globally</p>
            <h2 className="heading-section">Our Premium Fabrics</h2>
            <p className="text-text-secondary max-w-2xl mx-auto mt-4">
              We travel the world to bring you the finest fabrics — because
              premium quality starts at the source.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { country: "Egypt", fabric: "Premium Cotton" },
              { country: "Ireland", fabric: "Pure Linen" },
              { country: "Pakistan", fabric: "Traditional Blend" },
              { country: "Turkey", fabric: "Luxury Weaves" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center p-6 border border-border hover:border-gold/40 transition-colors"
              >
                <p className="text-xs uppercase tracking-widest text-gold mb-2">
                  {item.country}
                </p>
                <p className="font-serif text-lg text-charcoal">
                  {item.fabric}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIAL / TRUST ==================== */}
      <section className="section-padding bg-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-6">
            Our Promise
          </p>
          <blockquote className="font-serif text-2xl md:text-4xl leading-relaxed mb-8">
            "We don't just sell clothing. We craft garments that honor your
            faith, elevate your style, and become a part of your most precious
            moments."
          </blockquote>
          <p className="text-white/60 text-sm uppercase tracking-widest">
            — The THOBEIAN Team
          </p>
        </div>
      </section>

      {/* ==================== CONTACT INFO ==================== */}
      <section className="section-padding bg-background-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="heading-sub">Get In Touch</p>
            <h2 className="heading-section">We'd Love to Hear From You</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Visit Us",
                lines: ["Dhanmondi, Dhaka", "Bangladesh"],
              },
              {
                icon: Mail,
                title: "Email Us",
                lines: ["hello@thobeian.com", "support@thobeian.com"],
              },
              {
                icon: Phone,
                title: "Call Us",
                lines: ["+880 1XXX-XXXXXX", "Sat-Thu, 10AM-8PM"],
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="text-center p-8 bg-white border border-border hover:border-gold/40 transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/10 text-gold mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-serif text-xl text-charcoal mb-3">
                    {item.title}
                  </h3>
                  {item.lines.map((line, i) => (
                    <p key={i} className="text-sm text-text-secondary">
                      {line}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="heading-sub">Ready to Experience</p>
          <h2 className="font-serif text-3xl md:text-5xl text-charcoal mb-6">
            Discover THOBEIAN Today
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto">
            Browse our premium collection, or design your own custom thobe
            tailored just for you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/shop" className="btn-primary">
              Shop Collection
            </Link>
            <Link href="/custom-thobe" className="btn-outline">
              Customize Your Thobe
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
