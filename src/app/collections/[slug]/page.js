"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

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

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params.slug;

  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection();
  }, [slug]);

  const fetchCollection = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/collections/${slug}`);
      setCollection(data.data.collection);
      setProducts(data.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="font-serif text-3xl mb-4">Collection not found</h1>
        <Link href="/collections" className="btn-primary">
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={
            collection.bannerImage ||
            collection.image ||
            "/images/categories/thobe.jpg"
          }
          alt={collection.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">
            Collection
          </p>
          <h1 className="font-serif text-4xl md:text-6xl mb-4">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="text-white/80 max-w-2xl">{collection.description}</p>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-xs text-text-muted flex items-center gap-2">
            <Link href="/" className="hover:text-gold">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-gold">Collections</Link>
            <span>/</span>
            <span className="text-charcoal">{collection.name}</span>
          </nav>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-sm text-text-secondary mb-8">
          <strong>{products.length}</strong> products in this collection
        </p>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-secondary mb-4">
              No products in this collection yet.
            </p>
            <Link href="/shop" className="btn-outline">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={normalizeProduct(p)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
