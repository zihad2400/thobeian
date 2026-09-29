"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, initialized, fetchWishlist, toggleWishlist } =
    useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (!initialized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-text-secondary">Loading wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
        <Heart size={64} className="text-border mb-6" />
        <h1 className="font-serif text-3xl text-charcoal mb-3">
          Your Wishlist is Empty
        </h1>
        <p className="text-text-secondary mb-8 text-center max-w-md">
          Save your favorite items to see them here.
        </p>
        <Link href="/shop" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="heading-sub">Saved Items</p>
          <h1 className="font-serif text-4xl text-charcoal">
            My Wishlist ({items.length})
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((product) => (
            <div
              key={product._id}
              className="group relative bg-white border border-border hover:border-gold/40 transition-colors"
            >
              <Link
                href={`/product/${product.slug}`}
                className="block aspect-[3/4] overflow-hidden bg-background-secondary"
              >
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              <button
                onClick={() => toggleWishlist(product._id)}
                className="absolute top-3 right-3 p-2 bg-white/90 text-error hover:bg-error hover:text-white transition-colors"
                aria-label="Remove from wishlist"
              >
                <Heart size={16} className="fill-error" />
              </button>

              <div className="p-4">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-serif text-base text-charcoal hover:text-gold line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-charcoal mt-1">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
