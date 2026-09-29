"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { XCircle, Home, ShoppingBag, RefreshCw } from "lucide-react";

const REASONS = {
  cancelled: "You cancelled the payment.",
  failed: "Payment failed.",
  no_payment_id: "Payment ID missing.",
  execution_failed: "Payment execution failed.",
  order_not_found: "Order not found.",
  callback_error: "Something went wrong.",
};

function FailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "failed";

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background-luxury px-4 py-16">
      <div className="max-w-lg w-full bg-white border border-border p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-error/10 rounded-full mb-6">
          <XCircle size={48} className="text-error" />
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
          Payment Failed
        </h1>

        <p className="text-text-secondary mb-8">
          {REASONS[reason] || REASONS.failed}
        </p>

        <div className="space-y-3">
          <Link
            href="/checkout"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> Try Again
          </Link>
          <Link
            href="/cart"
            className="btn-outline w-full py-3 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} /> Back to Cart
          </Link>
          <Link
            href="/"
            className="btn-outline w-full py-3 flex items-center justify-center gap-2"
          >
            <Home size={16} /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FailedPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh]" />}>
      <FailedContent />
    </Suspense>
  );
}
