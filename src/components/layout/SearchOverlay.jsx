"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Search, X, TrendingUp, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const POPULAR_SEARCHES = [
  "Premium Thobe",
  "White Thobe",
  "Linen",
  "Eid Panjabi",
  "Band Collar",
  "Cotton",
];

export default function SearchOverlay({ isOpen, onClose }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    products: [],
    categories: [],
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults({ products: [], categories: [], total: 0 });
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], categories: [], total: 0 });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/search?q=${encodeURIComponent(query)}&limit=6`
        );
        setResults(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  const handlePopularClick = (term) => {
    setQuery(term);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white w-full max-h-[90vh] overflow-y-auto animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <form onSubmit={handleSubmit} className="flex items-center gap-4">
              <Search size={24} className="text-gold shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for thobe, panjabi, fabric..."
                className="flex-1 text-lg md:text-xl outline-none placeholder:text-text-muted bg-transparent"
              />
              {loading && <Loader2 size={20} className="animate-spin text-gold" />}
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:text-gold transition-colors"
                aria-label="Close search"
              >
                <X size={22} />
              </button>
            </form>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* No query — popular searches */}
          {!query.trim() && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-gold" />
                <h3 className="text-xs uppercase tracking-widest text-text-muted">
                  Popular Searches
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handlePopularClick(term)}
                    className="px-4 py-2 border border-border hover:border-gold hover:text-gold text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Query with no results */}
          {query.trim() && !loading && results.total === 0 && results.products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary">
                No results found for{" "}
                <strong className="text-charcoal">"{query}"</strong>
              </p>
              <p className="text-sm text-text-muted mt-2">
                Try different keywords or browse our collections
              </p>
            </div>
          )}

          {/* Categories */}
          {results.categories?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-widest text-text-muted mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {results.categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/c/${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 hover:bg-background-luxury transition-colors"
                  >
                    {cat.image && (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 object-cover"
                      />
                    )}
                    <span className="font-serif text-charcoal">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {results.products?.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-text-muted mb-4">
                Products ({results.total})
              </h3>
              <div className="space-y-2">
                {results.products.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 hover:bg-background-luxury transition-colors group"
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-16 h-20 object-cover shrink-0 bg-background-secondary"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-charcoal group-hover:text-gold transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-sm text-charcoal mt-1">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {results.total > results.products.length && (
                <button
                  onClick={handleSubmit}
                  className="w-full mt-4 py-3 border border-border hover:border-gold hover:text-gold text-sm uppercase tracking-widest transition-colors"
                >
                  View all {results.total} results →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
