"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { SlidersHorizontal, X } from "lucide-react";

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

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ minPrice: "", maxPrice: "" });

  useEffect(() => {
    fetchProducts();
  }, [page, sort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sort,
      });
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

      const { data } = await axios.get(`/api/products?${params}`);
      setProducts(data.data.products);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = () => {
    setPage(1);
    fetchProducts();
    setShowFilters(false);
  };

  const handleFilterClear = () => {
    setFilters({ minPrice: "", maxPrice: "" });
    setPage(1);
    setTimeout(fetchProducts, 0);
  };

  return (
    <div className="bg-white">
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="heading-sub">Browse Collection</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal">
            Shop All
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <p className="text-sm text-text-secondary">
            {loading ? (
              "Loading..."
            ) : (
              <>
                Showing <strong>{products.length}</strong> of{" "}
                <strong>{pagination.total}</strong> products
              </>
            )}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-border hover:border-gold text-sm transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-border hover:border-gold text-sm bg-white focus:outline-none focus:border-gold cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="bg-background-luxury border border-border p-6 mb-8 animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:text-gold"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-text-muted mb-2 block">
                  Min Price (৳)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-4 py-2 border border-border focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-text-muted mb-2 block">
                  Max Price (৳)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                  placeholder="10000"
                  className="w-full px-4 py-2 border border-border focus:border-gold outline-none"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={handleFilterApply}
                  className="btn-primary text-xs py-2 px-6"
                >
                  Apply
                </button>
                <button
                  onClick={handleFilterClear}
                  className="btn-outline text-xs py-2 px-6"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={normalizeProduct(product)}
              />
            ))}
          </div>
        )}

        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-border hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            >
              ← Previous
            </button>

            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 text-sm border transition-colors ${
                  page === i + 1
                    ? "bg-charcoal text-white border-charcoal"
                    : "border-border hover:border-gold"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
              className="px-4 py-2 border border-border hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
