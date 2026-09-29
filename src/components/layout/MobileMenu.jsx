"use client";

import Link from "next/link";
import { X, ChevronDown, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/ui/Logo";
import { useAuthStore } from "@/store/authStore";

export default function MobileMenu({ isOpen, onClose, menuItems = [] }) {
  const [expanded, setExpanded] = useState(null);
  const { user } = useAuthStore();

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      <div className="p-5 flex items-center justify-between border-b border-border">
        <Logo />
        <button onClick={onClose} aria-label="Close menu">
          <X size={24} />
        </button>
      </div>

      <nav className="p-5">
        {/* 🔐 ADMIN BUTTON — Mobile */}
        {isAdmin && (
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-3 p-4 mb-4 bg-charcoal text-white hover:bg-gold transition-colors"
          >
            <LayoutDashboard size={18} />
            <div>
              <p className="text-sm font-medium">Admin Panel</p>
              <p className="text-[10px] uppercase tracking-widest text-gold">
                Administrator Access
              </p>
            </div>
          </Link>
        )}

        <ul className="space-y-1">
          {menuItems.map((item, idx) => (
            <li key={idx} className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <Link
                  href={item.url || "#"}
                  className="block py-4 text-lg font-serif text-charcoal hover:text-gold transition-colors flex-1"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
                {item.hasDropdown && item.dropdown && (
                  <button
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                    className="p-2"
                    aria-label="Expand"
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        expanded === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {expanded === idx && item.dropdown && (
                <div className="pl-4 pb-4">
                  {item.dropdown.columns.map((column, colIdx) => (
                    <div key={colIdx}>
                      <h5 className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-2">
                        {column.title}
                      </h5>
                      <ul className="space-y-2 pl-2">
                        {column.items.map((sub, subIdx) => (
                          <li key={subIdx}>
                            <Link
                              href={sub.url}
                              className="block py-1 text-sm text-text-secondary hover:text-gold"
                              onClick={onClose}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
