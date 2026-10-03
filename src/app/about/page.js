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
    "Learn about THOBEIAN — Bangladesh's premium Islamic fashion brand.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative bg-background-luxury py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="heading-sub">Since 2020</p>
          <h1 className="font-serif text-5xl md:text-7xl text-charcoal mb-6 leading-tight">
            Crafted for the <br />
            <span className="text-gold">Modern Gentleman</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            THOBEIAN is Bangladesh's premier Islamic fashion house — where
            traditional elegance meets contemporary craftsmanship.
          </p>
          <div className="divider-gold mt-10" />
        </div>
      </section>

      {/* OUR STORY */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <img
                src="/images/home/brand-story.jpg"
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
                  Islamic fashion accessible to every Muslim gentleman.
                </p>
                <p>
                  What started as a small tailoring workshop in Dhaka has grown
                  into one of Bangladesh's most trusted Islamic fashion brands.
                </p>
                <p>
                  Every piece we create is a labor of love — honoring tradition
                  while embracing contemporary elegance.
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

      {/* MISSION & VISION */}
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
                embrace their identity with confidence and elegance.
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
                known for quality and unwavering commitment to values.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="heading-sub">Why THOBEIAN</p>
            <h2 className="heading-section">Why Choose Us</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Award, title: "Premium Quality", desc: "Finest fabrics from Egypt, Ireland, Pakistan, Turkey." },
              { icon: Sparkles, title: "Handcrafted Elegance", desc: "Master craftsmen with decades of experience." },
              { icon: Truck, title: "Fast Delivery", desc: "Nationwide delivery within 1-4 days." },
              { icon: ShieldCheck, title: "Secure Payment", desc: "bKash, Nagad, COD, Card payments." },
              { icon: RotateCcw, title: "Easy Returns", desc: "7-day hassle-free return policy." },
              { icon: Heart, title: "Customer First", desc: "10,000+ satisfied customers." },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 border border-border hover:border-gold/40 transition-all">
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

      {/* STATS */}
      <section className="section-padding bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-medium mb-3">
              Our Numbers
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">By the Numbers</h2>
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

      {/* FINAL CTA */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="heading-sub">Ready to Experience</p>
          <h2 className="font-serif text-3xl md:text-5xl text-charcoal mb-6">
            Discover THOBEIAN Today
          </h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/shop" className="btn-primary">Shop Collection</Link>
            <Link href="/custom-thobe" className="btn-outline">
              Customize Your Thobe
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
