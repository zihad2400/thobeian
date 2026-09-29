import Link from "next/link";
import { HERO_DATA } from "@/config/homeData";

export default function HeroSection() {
  return (
    <section className="relative bg-background-luxury overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px] py-16 lg:py-24">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-slide-up">
            <p className="heading-sub">{HERO_DATA.subtitle}</p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal leading-[1.05] mb-6">
              {HERO_DATA.title}
            </h1>
            <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto lg:mx-0">
              {HERO_DATA.description}
            </p>
            <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
              <Link href={HERO_DATA.primaryButton.url} className="btn-primary">
                {HERO_DATA.primaryButton.label}
              </Link>
              <Link
                href={HERO_DATA.secondaryButton.url}
                className="btn-outline"
              >
                {HERO_DATA.secondaryButton.label}
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-fade-in">
            <div className="relative aspect-[4/5] lg:aspect-[4/5] overflow-hidden">
              <img
                src={HERO_DATA.image}
                alt="Premium Thobe"
                className="w-full h-full object-cover"
              />
              {/* Gold accent decoration */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-gold/40 hidden lg:block" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />
    </section>
  );
}