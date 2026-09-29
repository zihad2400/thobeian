"use client";

import Link from "next/link";
import { useState } from "react";

export default function MegaMenu({ item, onClose }) {
  const [hoveredColumn, setHoveredColumn] = useState(null);

  if (!item.megaMenu) return null;

  return (
    <div
      className="absolute left-0 top-full w-full bg-white border-t border-b border-border shadow-luxury z-50 animate-slide-down"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Columns */}
          <div className="col-span-8 grid grid-cols-3 gap-8">
            {item.megaMenu.columns?.map((column, idx) => (
              <div key={idx}>
                <h4 className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">
                  {column.title}
                </h4>
                <ul className="space-y-2">
                  {column.items?.map((subItem, subIdx) => (
                    <li key={subIdx}>
                      <Link
                        href={subItem.url || "#"}
                        onClick={onClose}
                        className="text-sm text-text-secondary hover:text-gold transition-colors"
                      >
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Featured Image */}
          {item.megaMenu.featuredImage && (
            <div className="col-span-4">
              <Link href={item.megaMenu.featuredUrl || "#"} onClick={onClose}>
                <div className="relative overflow-hidden group">
                  <img
                    src={item.megaMenu.featuredImage}
                    alt={item.megaMenu.featuredTitle || "Featured"}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                    <p className="text-xs uppercase tracking-widest text-gold-light mb-1">
                      Featured
                    </p>
                    <h4 className="font-serif text-xl mb-2">
                      {item.megaMenu.featuredTitle}
                    </h4>
                    {item.megaMenu.featuredCta && (
                      <span className="text-sm underline underline-offset-4">
                        {item.megaMenu.featuredCta}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <Link
            href={item.url || "#"}
            onClick={onClose}
            className="text-sm text-charcoal hover:text-gold transition-colors uppercase tracking-widest"
          >
            View All →
          </Link>
        </div>
      </div>
    </div>
  );
}