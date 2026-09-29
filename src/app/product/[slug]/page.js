"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Heart,
  Star,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import ReviewForm from "@/components/product/ReviewForm";
import ReviewsList from "@/components/product/ReviewsList";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const addToCart = useCartStore((s) => s.addToCart);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products/${slug}`);
      setProduct(data.data.product);
      setRelated(data.data.related);

      // Fetch reviews
      try {
        const reviewsRes = await axios.get(`/api/products/${slug}/reviews`);
        setReviews(reviewsRes.data.data.reviews || []);
        setReviewSummary(
          reviewsRes.data.data.summary || {
            average: 0,
            total: 0,
            distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          }
        );
      } catch (err) {
        console.error("Reviews fetch error:", err);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        router.push("/404");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!user) {
      toast.error("Please login first");
      router.push("/login?redirect=/product/" + slug);
      return;
    }

    await addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!user) {
      toast.error("Please login first");
      router.push("/login?redirect=/product/" + slug);
      return;
    }

    const success = await addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    if (success) {
      router.push("/cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-text-secondary">Product not found</p>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const images = product.images?.length ? product.images : [product.hoverImage];

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-xs text-text-muted flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-gold">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gold">Shop</Link>
            <span>/</span>
            <span className="text-charcoal">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[3/4] overflow-hidden bg-background-secondary mb-4">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 badge-sale">
                  -{discount}%
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square overflow-hidden border-2 transition-colors ${
                      activeImage === idx
                        ? "border-gold"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="heading-sub">{product.category?.name || "Premium"}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(reviewSummary.average || product.rating || 0)
                        ? "fill-gold text-gold"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-text-muted">
                {reviewSummary.average || product.rating || 0} (
                {reviewSummary.total || product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="font-serif text-3xl text-charcoal">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-text-muted text-lg line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="bg-error text-white text-xs px-2 py-1">
                    Save {formatPrice(product.compareAtPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-text-secondary mb-8">
                {product.shortDescription}
              </p>
            )}

            {/* Color Selector */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <label className="text-xs uppercase tracking-widest text-text-muted mb-3 block">
                  Color:{" "}
                  {selectedColor && (
                    <span className="text-charcoal">{selectedColor}</span>
                  )}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        selectedColor === color
                          ? "border-gold bg-gold/10 text-charcoal"
                          : "border-border hover:border-gold"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <label className="text-xs uppercase tracking-widest text-text-muted mb-3 block">
                  Size:{" "}
                  {selectedSize && (
                    <span className="text-charcoal">{selectedSize}</span>
                  )}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[50px] px-4 py-2 text-sm border transition-colors ${
                        selectedSize === size
                          ? "border-charcoal bg-charcoal text-white"
                          : "border-border hover:border-gold"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="text-xs uppercase tracking-widest text-text-muted mb-3 block">
                Quantity
              </label>
              <div className="inline-flex items-center border border-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:text-gold"
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 text-charcoal">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 hover:text-gold"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.totalStock === 0}
              >
                <ShoppingBag size={16} className="mr-2" />
                {product.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <button
                className="p-4 border border-border hover:border-gold hover:text-gold transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart size={20} />
              </button>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleBuyNow}
              disabled={product.totalStock === 0}
            >
              Buy Now
            </Button>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div className="text-center">
                <Truck size={20} className="text-gold mx-auto mb-2" />
                <p className="text-xs text-text-secondary">Fast Delivery</p>
              </div>
              <div className="text-center">
                <Shield size={20} className="text-gold mx-auto mb-2" />
                <p className="text-xs text-text-secondary">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw size={20} className="text-gold mx-auto mb-2" />
                <p className="text-xs text-text-secondary">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Tabs */}
      <div className="border-t border-border bg-background-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-6 border-b border-border mb-8 overflow-x-auto">
            {["description", "fabric", "size_guide", "care", "shipping"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm uppercase tracking-widest whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? "text-gold border-b-2 border-gold"
                      : "text-text-secondary hover:text-charcoal"
                  }`}
                >
                  {tab.replace("_", " ")}
                </button>
              )
            )}
          </div>

          <div className="prose max-w-none">
            {activeTab === "description" && (
              <p className="text-text-secondary leading-relaxed">
                {product.description || "No description available."}
              </p>
            )}
            {activeTab === "fabric" && (
              <p className="text-text-secondary leading-relaxed">
                {product.fabric
                  ? `${product.fabric.name} — Premium quality fabric sourced with care.`
                  : "Premium fabric details coming soon."}
              </p>
            )}
            {activeTab === "size_guide" && (
              <p className="text-text-secondary leading-relaxed">
                Size guide: S (38), M (40), L (42), XL (44), XXL (46)
              </p>
            )}
            {activeTab === "care" && (
              <p className="text-text-secondary leading-relaxed">
                Machine wash cold. Do not bleach. Iron on low heat. Dry clean
                recommended for best results.
              </p>
            )}
            {activeTab === "shipping" && (
              <p className="text-text-secondary leading-relaxed">
                Inside Dhaka: 1-2 days (৳80). Outside Dhaka: 2-4 days (৳130).
                Express delivery available.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ===== REVIEWS SECTION ===== */}
      <div className="border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="heading-sub">Customer Feedback</p>
              <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-0">
                Reviews ({reviewSummary.total})
              </h2>
            </div>
            {!showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn-primary text-xs py-2.5 px-5"
              >
                ✍️ Write a Review
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm
                productSlug={slug}
                onSuccess={() => {
                  setShowReviewForm(false);
                  fetchProduct();
                }}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          {/* Reviews List */}
          <ReviewsList reviews={reviews} summary={reviewSummary} />
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <p className="heading-sub">You May Also Like</p>
            <h2 className="heading-section">Related Products</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <Link key={p._id} href={`/product/${p.slug}`} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-background-secondary mb-3">
                  <img
                    src={p.images?.[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-serif text-sm text-charcoal group-hover:text-gold transition-colors line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-sm text-charcoal mt-1">
                  {formatPrice(p.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
