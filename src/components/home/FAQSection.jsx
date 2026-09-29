"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/config/homeData";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="section-padding bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="heading-sub">Questions?</p>
          <h2 className="heading-section">Frequently Asked</h2>
          <div className="divider-gold mt-6" />
        </div>

        {/* FAQ List */}
        <div className="space-y-2">
          {FAQS.map((faq, idx) => (
            <div
              key={faq._id}
              className="border border-border hover:border-gold/40 transition-colors"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-serif text-base md:text-lg text-charcoal pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-gold shrink-0 transition-transform duration-300 ${
                    openIdx === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-text-secondary text-sm leading-relaxed animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}