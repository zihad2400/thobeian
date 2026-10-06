"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    items,
    initialized,
    fetchCart,
    updateQuantity,
    removeItem,
    getSubtotal,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = getSubtotal();
  const shipping = subtotal > 5000 ? 0 : 80;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  if (!initialized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-text-secondary">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
        <ShoppingBag size={64} className="text-border mb-6" />
        <h1 className="font-serif text-3xl text-charcoal mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-text-secondary mb-8 text-center max-w-md">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link href="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="heading-sub">Shopping Bag</p>
          <h1 className="font-serif text-4xl text-charcoal">
            Your Cart ({items.length})
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 p-4 border border-border bg-white"
              >
                <div className="w-24 h-32 shrink-0 overflow-hidden bg-background-secondary">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#faf9f6] to-[#efe8dc]">
                      <span className="text-xs font-medium tracking-wide text-[#8b7a62] text-center px-2">
                        Custom Thobe
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-serif text-lg text-charcoal">
                        {item.name}
                      </h3>
                      <div className="flex gap-3 mt-1 text-xs text-text-muted uppercase tracking-widest">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="p-2 text-text-muted hover:text-error transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="p-2 hover:text-gold"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="p-2 hover:text-gold"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <p className="text-charcoal font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-background-luxury border border-border p-6 sticky top-24">
              <h2 className="font-serif text-xl text-charcoal mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-charcoal">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Shipping</span>
                  <span className="text-charcoal">
                    {shipping === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-serif text-lg">Total</span>
                <span className="font-serif text-2xl text-charcoal">
                  {formatPrice(total)}
                </span>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full mb-3"
                onClick={handleCheckout}
              >
                Proceed to Checkout <ArrowRight size={16} className="ml-2" />
              </Button>

              <Link
                href="/shop"
                className="block text-center text-sm text-text-secondary hover:text-gold transition-colors"
              >
                Continue Shopping
              </Link>

              {shipping > 0 && (
                <p className="mt-4 text-xs text-center text-text-muted">
                  Add {formatPrice(5000 - subtotal)} more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
