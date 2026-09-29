import { BRAND_STORY } from "@/config/homeData";

export default function BrandStory() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <img
              src={BRAND_STORY.image}
              alt={BRAND_STORY.title}
              className="w-full aspect-[4/5] object-cover"
            />
            {/* Gold accent */}
            <div className="absolute -top-6 -right-6 w-32 h-32 border border-gold/40 hidden lg:block" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="heading-sub">{BRAND_STORY.subtitle}</p>
            <h2 className="heading-section">{BRAND_STORY.title}</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              {BRAND_STORY.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {BRAND_STORY.stats.map((stat, idx) => (
                <div key={idx} className="border-l-2 border-gold pl-4">
                  <p className="font-serif text-3xl md:text-4xl text-charcoal mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}