"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";
import AnnouncementBar from "./AnnouncementBar";
import { NAVBAR_MENU } from "@/config/navbarData";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function Navbar() {
  const [menuItems] = useState(NAVBAR_MENU);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [closeTimer, setCloseTimer] = useState(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const { user, initialized } = useAuthStore();
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const isAdmin =
    mounted &&
    initialized &&
    user !== null &&
    user !== undefined &&
    (user?.role === "admin" || user?.role === "superadmin");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseEnter = (idx) => {
    if (closeTimer) clearTimeout(closeTimer);
    setOpenDropdown(idx);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => setOpenDropdown(null), 200);
    setCloseTimer(timer);
  };

  const isActive = (item) => {
    if (item.url === "/") {
      return pathname === "/";
    }
    return pathname === item.url || pathname.startsWith(item.url + "/");
  };

  return (
    <>
      {/* Dynamic Announcement Bar */}
      <AnnouncementBar />

      <header
        className={`sticky top-0 z-50 bg-white transition-shadow ${
          scrolled ? "shadow-soft" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-2">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-1.5 shrink-0"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            {/* Logo */}
            <div className="shrink-0">
              <Logo />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0 flex-1 justify-center px-4">
              {menuItems.map((item, idx) => {
                const active = isActive(item);
                return (
                  <div
                    key={idx}
                    className="relative"
                    onMouseEnter={() =>
                      item.hasDropdown && handleMouseEnter(idx)
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={item.url}
                      className={`flex items-center gap-1.5 px-3 xl:px-4 py-2 text-sm tracking-wide uppercase transition-colors relative whitespace-nowrap ${
                        active || openDropdown === idx
                          ? "text-gold"
                          : "text-charcoal hover:text-gold"
                      }`}
                    >
                      {item.label}
                      {item.hasDropdown && (
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-300 ${
                            openDropdown === idx ? "rotate-180" : ""
                          }`}
                        />
                      )}
                      {active && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold" />
                      )}
                    </Link>

                    {item.hasDropdown &&
                      openDropdown === idx &&
                      item.dropdown && (
                        <DropdownMenu
                          item={item}
                          onClose={() => setOpenDropdown(null)}
                        />
                      )}
                  </div>
                );
              })}
            </nav>

            {/* Right Icons — Visible on ALL devices */}
            <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 shrink-0">
              {/* Admin Button (Desktop only) */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-widest transition-colors border ${
                    pathname.startsWith("/admin")
                      ? "bg-gold text-white border-gold"
                      : "bg-charcoal text-white border-charcoal hover:bg-gold hover:border-gold"
                  }`}
                  title="Admin Panel"
                >
                  <LayoutDashboard size={14} />
                  Admin
                </Link>
              )}

              {/* Search — Mobile + Desktop */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 sm:p-2 hover:text-gold transition-colors"
                aria-label="Search"
              >
                <Search size={18} className="sm:w-5 sm:h-5" />
              </button>

              {/* Wishlist — Mobile + Desktop (NO hidden) */}
              <Link
                href="/wishlist"
                className={`relative p-1.5 sm:p-2 transition-colors ${
                  pathname === "/wishlist" ? "text-gold" : "hover:text-gold"
                }`}
                aria-label="Wishlist"
              >
                <Heart size={18} className="sm:w-5 sm:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[9px] sm:text-[10px] font-bold rounded-full min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] flex items-center justify-center">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account — Mobile + Desktop (NO hidden) */}
              <Link
                href={user ? "/account" : "/login"}
                className={`p-1.5 sm:p-2 transition-colors ${
                  pathname === "/account" || pathname === "/login"
                    ? "text-gold"
                    : "hover:text-gold"
                }`}
                aria-label="Account"
              >
                <User size={18} className="sm:w-5 sm:h-5" />
              </Link>

              {/* Cart — Mobile + Desktop */}
              <Link
                href="/cart"
                className={`relative p-1.5 sm:p-2 transition-colors ${
                  pathname === "/cart" ? "text-gold" : "hover:text-gold"
                }`}
                aria-label="Cart"
              >
                <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[9px] sm:text-[10px] font-bold rounded-full min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        menuItems={menuItems}
      />
    </>
  );
}

function DropdownMenu({ item, onClose }) {
  const { dropdown } = item;

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50"
      onMouseLeave={onClose}
    >
      <div className="bg-white border border-border shadow-luxury min-w-[260px] animate-slide-down rounded-2xl overflow-hidden">
        <div className="p-5">
          {dropdown.columns.map((column, idx) => (
            <div key={idx}>
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold mb-4 pb-2 border-b border-border">
                {column.title}
              </h4>
              <ul className="space-y-2.5">
                {column.items.map((subItem, subIdx) => (
                  <li key={subIdx}>
                    <Link
                      href={subItem.url}
                      onClick={onClose}
                      className="block text-sm text-text-secondary hover:text-gold hover:translate-x-1 transition-all duration-200"
                    >
                      {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-5 py-3 bg-background-secondary">
          <Link
            href={item.url}
            onClick={onClose}
            className="text-xs text-charcoal hover:text-gold uppercase tracking-widest transition-colors"
          >
            View All {item.label} →
          </Link>
        </div>
      </div>
    </div>
  );
}
