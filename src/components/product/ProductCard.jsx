"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Star, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function ProductCard({ product }) {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);
  const { user } = useAuthStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    if (!product.inStock) {
      toast.error("Out of stock");
      return;
    }

    // Default to first size
    const defaultSize = product.sizes?.[0] || "M";
    const defaultColor = product.colors?.[0] || "";

    await addToCart(
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      {
        size: defaultSize,
        color: defaultColor,
        quantity: 1,
      }
    );
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    await toggleWishlist(product._id);
  };

  return (
    <div className="group relative bg-white border border-border hover:border-gold/40 transition-colors">
      <Link
        href={`/product/${product.slug}`}
        className="block relative aspect-[3/4] overflow-hidden bg-background-secondary"
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-500"
        />
        <img
          src={product.hoverImage || product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && <span className="badge-sale">-{discount}%</span>}
          {product.badge === "new" && <span className="badge-gold">New</span>}
          {product.badge === "bestseller" && (
            <span className="badge-gold">Bestseller</span>
          )}
          {product.badge === "featured" && (
            <span className="badge-gold">Featured</span>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-charcoal">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 p-2 bg-white/90 transition-colors z-10 ${
          inWishlist
            ? "text-error"
            : "text-charcoal hover:bg-gold hover:text-white"
        }`}
        aria-label="Add to wishlist"
      >
        <Heart size={16} className={inWishlist ? "fill-error" : ""} />
      </button>

      {/* Quick Add to Cart */}
      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={handleAddToCart}
          className="w-full bg-charcoal hover:bg-gold text-white py-2.5 text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          disabled={!product.inStock}
        >
          <ShoppingBag size={14} />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>

      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-base text-charcoal hover:text-gold transition-colors mb-1 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.floor(product.rating || 0)
                    ? "fill-gold text-gold"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-xs text-text-muted">
            ({product.reviewCount || 0})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-charcoal font-medium">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-text-muted text-sm line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
