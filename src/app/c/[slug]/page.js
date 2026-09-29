"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "name_az", label: "Name: A to Z" },
  { value: "bestselling", label: "Best Selling" },
];

const normalizeProduct = (p) => ({
  _id: p._id,
  name: p.name,
  slug: p.slug,
  image: p.images?.[0] || "",
  hoverImage: p.hoverImage || p.images?.[1] || p.images?.[0] || "",
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
  inStock: (p.totalStock || 0) > 0,
  sizes: p.sizes || [],
  colors: p.colors || [],
});

export default function DynamicCategoryPage() {
  const params = useParams();
  const slug = params.slug;

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    fetchCategory();
  }, [slug]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/categories/${slug}`);
      setCategory(data.data.category);
      setSubcategories(data.data.subcategories || []);
      setProducts(data.data.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sort) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "name_az":
        return a.name.localeCompare(b.name);
      case "bestselling":
        return (b.soldCount || 0) - (a.soldCount || 0);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="font-serif text-3xl">Category not found</h1>
        <Link href="/shop" className="btn-primary">
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-xs text-text-muted mb-4 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-gold">Home</Link>
            <span>/</span>
            {category.parent && (
              <>
                <Link href={`/c/${category.parent.slug}`} className="hover:text-gold">
                  {category.parent.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-charcoal">{category.name}</span>
          </nav>
          <p className="heading-sub">Category</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-3">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-text-secondary max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Subcategories */}
        {subcategories.length > 0 && (
          <div className="mb-10 pb-8 border-b border-border">
            <p className="text-xs uppercase tracking-widest text-text-muted mb-4">
              Browse Subcategories
            </p>
            <div className="flex flex-wrap gap-3">
              {subcategories.map((sub) => (
                <Link
                  key={sub._id}
                  href={`/c/${sub.slug}`}
                  className="px-5 py-2 border border-border hover:border-gold hover:bg-gold/5 text-sm transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <p className="text-sm text-text-secondary">
            <strong>{products.length}</strong> products
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 border border-border hover:border-gold text-sm bg-white focus:outline-none focus:border-gold cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary mb-4">
              No products in this category yet.
            </p>
            <Link href="/shop" className="btn-outline">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sortedProducts.map((p) => (
              <ProductCard key={p._id} product={normalizeProduct(p)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
