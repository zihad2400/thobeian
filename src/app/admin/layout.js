"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Star,
  ShoppingBag,
  Scissors,
  Mail,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "@/lib/toast";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Products", icon: Package, href: "/admin/products" },
  { label: "Categories", icon: FolderTree, href: "/admin/categories" },
  { label: "Reviews", icon: Star, href: "/admin/reviews" },
  { label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
  { label: "Custom Orders", icon: Scissors, href: "/admin/custom-orders" },
  { label: "Newsletter", icon: Mail, href: "/admin/newsletter" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, initialized, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (initialized && !user) {
      router.push("/login?redirect=/admin");
      return;
    }
    if (initialized && user && user.role !== "admin" && user.role !== "superadmin") {
      toast.error("Admin access required");
      router.push("/");
    }
  }, [initialized, user, router]);

  if (!initialized || !user || (user.role !== "admin" && user.role !== "superadmin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-luxury">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-muted">Checking access...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background-luxury flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-charcoal text-white sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="block">
            <p className="font-serif text-2xl tracking-wider">THOBEIAN</p>
            <p className="text-[10px] uppercase tracking-widest text-gold mt-1">
              Admin Panel
            </p>
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors mb-1 ${
                  active
                    ? "bg-gold text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white transition-colors"
          >
            <Home size={16} /> View Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-error transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-charcoal text-white overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="font-serif text-xl">THOBEIAN</p>
                <p className="text-[10px] uppercase tracking-widest text-gold">Admin</p>
              </div>
              <button onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <nav className="p-4">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm mb-1 ${
                      active ? "bg-gold text-white" : "text-white/70"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="bg-white border-b border-border sticky top-0 z-40">
          <div className="px-4 md:px-8 py-4 flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2"
            >
              <Menu size={20} />
            </button>
            <div className="flex-1">
              <p className="text-xs text-text-muted">
                Welcome back, <span className="text-charcoal font-medium">{user.name}</span>
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-widest bg-gold/10 text-gold px-3 py-1.5">
              {user.role}
            </span>
          </div>
        </div>

        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
