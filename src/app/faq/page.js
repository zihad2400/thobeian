"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "How do I choose the right size?", a: "Check our Size Guide for detailed measurements. For custom fit, use our Custom Thobe service." },
  { q: "What is your return policy?", a: "We accept returns within 7 days of delivery for unused items in original packaging. Custom orders are non-returnable unless defective." },
  { q: "How long does shipping take?", a: "Inside Dhaka: 1-2 days (৳80). Outside Dhaka: 2-4 days (৳130). Express: same day (৳200)." },
  { q: "Do you offer custom tailoring?", a: "Yes! Our Custom Thobe service lets you choose fabric, color, collar, buttons, and provide exact measurements." },
  { q: "What payment methods do you accept?", a: "We accept bKash, Nagad, SSLCommerz (card), and Cash on Delivery across Bangladesh." },
  { q: "How can I track my order?", a: "You'll receive tracking info via SMS/email. Also check My Orders in your account." },
  { q: "Are your fabrics authentic?", a: "Yes — we source from Egypt, Ireland, Pakistan, and Turkey. Every fabric is verified for quality." },
  { q: "Do you ship internationally?", a: "Currently we ship within Bangladesh only. International shipping coming soon." },
];

export default function FAQPage() {
  const [open, setOpen] = useState(0);

  return (
    <div className="bg-white">
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="heading-sub">Help Center</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Frequently Asked</h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Find answers to common questions about THOBEIAN.
          </p>
          <div className="divider-gold mt-8" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-3">
        {FAQS.map((faq, i) => (
          <div key={i} className="border border-border hover:border-gold/40 transition-colors">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="font-serif text-base md:text-lg text-charcoal pr-4">{faq.q}</span>
              <ChevronDown size={20} className={`text-gold shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-text-secondary text-sm leading-relaxed">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
