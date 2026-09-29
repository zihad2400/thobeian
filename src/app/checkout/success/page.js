"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background-luxury px-4 py-16">
      <div className="max-w-lg w-full bg-white border border-border p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
          <CheckCircle size={48} className="text-success" />
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
          Order Confirmed!
        </h1>

        <p className="text-text-secondary mb-6 leading-relaxed">
          Thank you for your order! We'll process it and notify you when it
          ships.
        </p>

        {orderNumber && (
          <div className="bg-gold/5 border border-gold/30 p-4 mb-8">
            <p className="text-[10px] uppercase tracking-widest text-gold mb-1">
              Order Number
            </p>
            <p className="font-mono text-lg text-charcoal font-bold">
              {orderNumber}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/account/orders"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            <Package size={16} /> Track My Order
          </Link>
          <Link
            href="/shop"
            className="btn-outline w-full py-3 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
          <Link
            href="/"
            className="btn-outline w-full py-3 flex items-center justify-center gap-2"
          >
            <Home size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh]" />}>
      <SuccessContent />
    </Suspense>
  );
}
