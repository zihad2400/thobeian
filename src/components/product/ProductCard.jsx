"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import RatingStars from "@/components/ui/RatingStars";

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
    <div className="group relative bg-white border border-border hover:border-gold/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl overflow-hidden">
      {/* ===== IMAGE CONTAINER — FIXED ASPECT RATIO ===== */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative w-full overflow-hidden bg-background-secondary"
        style={{ paddingBottom: "133.33%" /* 3:4 ratio = 4/3 * 100 = 133.33% */ }}
      >
        <div className="absolute inset-0">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:opacity-0 group-hover:scale-105 transition-all duration-700"
            loading="lazy"
          />
          <img
            src={product.hoverImage || product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
            loading="lazy"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {discount > 0 && (
            <span className="badge-sale text-[10px] rounded-full px-2.5">-{discount}%</span>
          )}
          {product.badge === "new" && (
            <span className="badge-gold text-[10px] rounded-full px-2.5">New</span>
          )}
          {product.badge === "bestseller" && (
            <span className="badge-gold text-[10px] rounded-full px-2.5">Bestseller</span>
          )}
          {product.badge === "featured" && (
            <span className="badge-gold text-[10px] rounded-full px-2.5">Featured</span>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <span className="text-xs uppercase tracking-widest text-charcoal border border-charcoal px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm transition-all z-10 rounded-full shadow-sm ${
          inWishlist ? "text-error" : "text-charcoal hover:bg-gold hover:text-white"
        }`}
        aria-label="Wishlist"
      >
        <Heart size={16} className={inWishlist ? "fill-error" : ""} />
      </button>

      {/* Add to Cart */}
      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full bg-charcoal hover:bg-gold text-white py-3 text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50 rounded-full"
        >
          <ShoppingBag size={14} />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>

      {/* Info */}
      <div className="p-4 md:p-5">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-base md:text-lg text-charcoal hover:text-gold transition-colors mb-2 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 mb-3">
          <RatingStars
            value={Math.round(product.rating || 0)}
            size={12}
            readonly
            showCount={false}
          />
          <span className="text-xs text-text-muted">
            ({product.reviewCount || 0})
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-charcoal font-medium text-base md:text-lg">
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
