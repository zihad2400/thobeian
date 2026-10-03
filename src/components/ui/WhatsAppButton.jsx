"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import { WhatsAppIcon } from "./SocialIcons";

export default function WhatsAppButton({
  phoneNumber = "8801XXXXXXXXX",
  message = "Hello THOBEIAN! I need help with my order.",
  position = "bottom-right",
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay appearance for smooth animation
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className={`fixed z-50 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${
        position === "bottom-right"
          ? "bottom-6 right-6"
          : position === "bottom-left"
          ? "bottom-6 left-6"
          : "bottom-6 right-6"
      }`}
    >
      {/* Tooltip / Chat Bubble */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-3 bg-white border border-border shadow-luxury rounded-lg overflow-hidden animate-slide-up w-72">
          {/* Header */}
          <div className="bg-[#25D366] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <WhatsAppIcon size={20} />
              </div>
              <div>
                <p className="font-medium text-sm">THOBEIAN Support</p>
                <p className="text-xs text-white/80">Typically replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-white/80 hover:text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Message */}
          <div className="p-4 bg-[#ECE5DD]">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-sm text-charcoal">
                👋 Hi there! How can we help you today?
              </p>
              <p className="text-[10px] text-text-muted mt-1">
                Chat with us on WhatsApp
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="p-3 bg-white border-t border-border">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#25D366] hover:bg-[#20b858] text-white text-center py-3 text-xs uppercase tracking-widest font-medium transition-colors"
            >
              Start Chat →
            </a>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="relative group flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20b858] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        {showTooltip ? (
          <X size={24} />
        ) : (
          <WhatsAppIcon size={26} />
        )}

        {/* Pulse Animation */}
        {!showTooltip && (
          <>
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </>
        )}
      </button>
    </div>
  );
}
