import Link from "next/link";
import { CUSTOM_THOBE_CTA } from "@/config/homeData";

export default function CustomThobeCTA() {
  return (
    <section className="relative overflow-hidden bg-charcoal text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 items-center">
          {/* Image */}
          <div className="relative h-[400px] lg:h-[600px]">
            <img
              src={CUSTOM_THOBE_CTA.image}
              alt={CUSTOM_THOBE_CTA.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-charcoal hidden lg:block" />
          </div>

          {/* Content */}
          <div className="p-8 md:p-16 lg:p-20 text-center lg:text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-medium mb-4">
              {CUSTOM_THOBE_CTA.subtitle}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              {CUSTOM_THOBE_CTA.title}
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-lg mx-auto lg:mx-0">
              {CUSTOM_THOBE_CTA.description}
            </p>
            <Link
              href={CUSTOM_THOBE_CTA.button.url}
              className="inline-flex items-center justify-center px-8 py-4 bg-gold hover:bg-gold-dark text-white text-sm uppercase tracking-widest font-medium transition-colors"
            >
              {CUSTOM_THOBE_CTA.button.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}