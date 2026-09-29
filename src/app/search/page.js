"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

const normalizeProduct = (p) => ({
  _id: p._id,
  name: p.name,
  slug: p.slug,
  image: p.images?.[0] || "",
  hoverImage: p.images?.[1] || p.images?.[0] || "",
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

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [inputValue, setInputValue] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputValue(query);
    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/search?q=${encodeURIComponent(query)}&limit=50&full=true`
      );
      setProducts(data.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputValue)}`);
    }
  };

  return (
    <div className="bg-white">
      {/* Header with Search Bar */}
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="heading-sub">Search Results</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
            Find What You're Looking For
          </h1>

          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-1 flex items-center border border-border focus-within:border-gold bg-white">
              <SearchIcon size={20} className="ml-4 text-text-muted" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-3 outline-none"
              />
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!query ? (
          <div className="text-center py-20">
            <SearchIcon size={64} className="text-border mx-auto mb-6" />
            <p className="text-text-secondary">
              Enter a search term to find products
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-secondary mb-8">
              {loading ? (
                "Searching..."
              ) : (
                <>
                  <strong>{products.length}</strong> results for{" "}
                  <strong className="text-charcoal">"{query}"</strong>
                </>
              )}
            </p>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-text-secondary mb-4">
                  No products found for{" "}
                  <strong className="text-charcoal">"{query}"</strong>
                </p>
                <Link href="/shop" className="btn-outline">
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id} product={normalizeProduct(p)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <SearchContent />
    </Suspense>
  );
}
