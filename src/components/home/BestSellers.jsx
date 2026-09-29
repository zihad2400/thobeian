"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBest();
  }, []);

  const fetchBest = async () => {
    try {
      const { data } = await axios.get("/api/products", {
        params: { bestseller: "true", limit: 4 },
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
    badge: p.bestseller ? "bestseller" : null,
    inStock: p.totalStock > 0,
    sizes: p.sizes || [],
    colors: p.colors || [],
  });

  return (
    <section className="section-padding bg-background-luxury">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="heading-sub">Customer Favorites</p>
            <h2 className="heading-section mb-0">Best Sellers</h2>
          </div>
          <Link
            href="/shop?sort=bestselling"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-charcoal hover:text-gold transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={normalize(p)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
