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

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  const categoryName = slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1)
    : "Shop";

  useEffect(() => {
    fetchProducts();
  }, [slug, sort, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/products", {
        params: { category: slug, sort, page, limit: 12 },
      });
      setProducts(data.data.products);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-xs text-text-muted mb-3 flex items-center gap-2">
            <Link href="/" className="hover:text-gold">
              Home
            </Link>
            <span>/</span>
            <span className="text-charcoal">{categoryName}</span>
          </nav>
          <p className="heading-sub">Collection</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal">
            {categoryName}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <p className="text-sm text-text-secondary">
            {loading ? (
              "Loading..."
            ) : (
              <>
                <strong>{pagination.total}</strong> products found
              </>
            )}
          </p>

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

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary">
              No products in this category yet.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-4 text-gold hover:text-gold-dark"
            >
              Browse all products →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={normalizeProduct(product)}
              />
            ))}
          </div>
        )}

        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 text-sm border ${
                  page === i + 1
                    ? "bg-charcoal text-white border-charcoal"
                    : "border-border hover:border-gold"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
