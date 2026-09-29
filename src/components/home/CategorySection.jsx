import Link from "next/link";
import { CATEGORIES } from "@/config/homeData";

export default function CategorySection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="heading-sub">Shop by Category</p>
          <h2 className="heading-section">Explore Our Collections</h2>
          <div className="divider-gold mt-6" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {CATEGORIES.map((category, idx) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="group relative overflow-hidden aspect-[3/4] block"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-4 md:p-6 text-center text-white">
                <h3 className="font-serif text-xl md:text-2xl mb-1 group-hover:text-gold transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-white/70 uppercase tracking-widest">
                  {category.productCount > 0
                    ? `${category.productCount} Products`
                    : "Customizable"}
                </p>
                <span className="mt-3 text-xs uppercase tracking-wider border-b border-white/50 pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}