"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const { data } = await axios.get("/api/products", {
        params: { featured: "true", limit: 8 },
      });
      setProducts(data.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const normalize = (p) => ({
    _id: p._id,
    name: p.name,
    slug: p.slug,
    image: p.images?.[0],
    hoverImage: p.hoverImage || p.images?.[1] || p.images?.[0],
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    rating: p.rating || 0,
    reviewCount: p.reviewCount || 0,
    badge: p.bestseller
      ? "bestseller"
      : p.featured
      ? "featured"
      : p.newArrival
      ? "new"
      : null,
    inStock: p.totalStock > 0,
    sizes: p.sizes || [],
    colors: p.colors || [],
  });

  // Split products into two rows of 4
  const firstRow = products.slice(0, 4);
  const secondRow = products.slice(0, 4); // ← Same 4 products (duplicate)

  // For loading state — 4 skeletons per row
  const loadingRow = [...Array(4)];

  return (
    <section className="section-padding bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-4">
          <div>
            <p className="heading-sub">Handpicked For You</p>
            <h2 className="heading-section mb-0">Featured Products</h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-charcoal hover:text-gold transition-colors group"
          >
            View All
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* ROW 1 */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-5 md:mb-6">
            {loadingRow.map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-5 md:mb-6">
            {firstRow.map((p, idx) => (
              <ProductCard
                key={`row1-${p._id}-${idx}`}
                product={normalize(p)}
              />
            ))}
          </div>
        )}

        {/* ROW 2 — Same products, different key */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {loadingRow.map((_, i) => (
              <ProductCardSkeleton key={`skeleton-2-${i}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {secondRow.map((p, idx) => (
              <ProductCard
                key={`row2-${p._id}-${idx}`}
                product={normalize(p)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
