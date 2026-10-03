"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/config/homeData";

export default function CategorySection() {
  const firstRow = CATEGORIES.slice(0, 4);
  const secondRow = CATEGORIES.slice(4, 8);

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="heading-sub">Shop by Category</p>
          <h2 className="heading-section">Explore Our Collections</h2>
          <div className="divider-gold mt-6" />
        </div>

        {/* ROW 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-5 md:mb-6">
          {firstRow.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {secondRow.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 text-xs uppercase tracking-widest font-medium rounded-full"
          >
            View All Products
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }) {
  return (
    <Link
      href={`/c/${category.slug}`}
      className="group relative overflow-hidden block rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
      style={{ paddingBottom: "133.33%" }} /* 3:4 aspect ratio */
    >
      <div className="absolute inset-0">
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out rounded-3xl"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-all duration-300 rounded-3xl" />
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/60 transition-colors duration-500 rounded-3xl" />

      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 text-white">
        <p className="text-[10px] uppercase tracking-[0.25em] text-gold mb-2 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          Shop Now
        </p>

        <h3 className="font-serif text-2xl md:text-3xl mb-2 group-hover:text-gold transition-colors duration-300">
          {category.name}
        </h3>

        <p className="text-xs text-white/70 uppercase tracking-widest mb-4">
          {category.productCount > 0
            ? `${category.productCount} Products`
            : "Customizable"}
        </p>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <span className="text-xs uppercase tracking-widest border-b border-gold/60 pb-0.5 group-hover:border-gold transition-colors">
            Explore
          </span>
          <ArrowRight
            size={12}
            className="text-gold group-hover:translate-x-1 transition-transform"
          />
        </div>

        <div className="absolute top-5 left-5 w-8 h-px bg-gold/60 group-hover:w-12 transition-all duration-500" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-b-3xl" />
    </Link>
  );
}
