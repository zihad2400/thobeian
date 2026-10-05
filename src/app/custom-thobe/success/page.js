"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle, Home, Package, Share2 } from "lucide-react";
import toast from "@/lib/toast";

function SuccessContent() {
  const searchParams = useSearchParams();
  const designId = searchParams.get("design");

  const handleShare = () => {
    if (!designId) return;
    const url = `${window.location.origin}/custom-thobe?design=${designId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background-luxury px-4 py-16">
      <div className="max-w-lg w-full bg-white border border-border p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
          <CheckCircle size={48} className="text-success" />
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
          Design Submitted!
        </h1>

        <p className="text-text-secondary mb-8 leading-relaxed">
          Thank you! Your custom thobe design has been submitted successfully.
          Our team will review your measurements and contact you shortly.
        </p>

        {designId && (
          <div className="bg-gold/5 border border-gold/30 p-4 mb-8">
            <p className="text-[10px] uppercase tracking-widest text-gold mb-1">
              Your Design ID
            </p>
            <p className="font-mono text-xl text-charcoal font-bold">
              {designId}
            </p>
            <p className="text-xs text-text-muted mt-2">
              Save this ID to track or edit your design later
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/account/orders"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            <Package size={16} /> View My Orders
          </Link>

          <button
            onClick={handleShare}
            className="btn-outline w-full py-3 flex items-center justify-center gap-2"
          >
            <Share2 size={16} /> Share Design
          </button>

          <Link
            href="/"
            className="btn-outline w-full py-3 flex items-center justify-center gap-2"
          >
            <Home size={16} /> Back to Home
          </Link>
        </div>

        <p className="text-xs text-text-muted mt-8">
          A confirmation email will be sent shortly.
        </p>
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
