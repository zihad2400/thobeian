"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Scissors,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/lib/utils";

export default function AccountPage() {
  const router = useRouter();
  const { user, initialized, logout } = useAuthStore();
  const [stats, setStats] = useState({ orders: 0, custom: 0, wishlist: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialized && !user) {
      router.push("/login?redirect=/account");
    }
  }, [initialized, user, router]);

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const [ordersRes, wishlistRes] = await Promise.allSettled([
        axios.get("/api/orders"),
        axios.get("/api/wishlist"),
      ]);

      setStats({
        orders:
          ordersRes.status === "fulfilled"
            ? ordersRes.value.data.data.orders?.length || 0
            : 0,
        custom:
          ordersRes.status === "fulfilled"
            ? ordersRes.value.data.data.customDesigns?.length || 0
            : 0,
        wishlist:
          wishlistRes.status === "fulfilled"
            ? wishlistRes.value.data.data.products?.length || 0
            : 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/");
  };

  if (!initialized || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background-luxury">
        <Loader2 size={40} className="animate-spin text-gold" />
      </div>
    );
  }

  const menuItems = [
    { label: "Dashboard", icon: User, href: "/account", active: true },
    { label: "My Orders", icon: Package, href: "/account/orders" },
    { label: "Wishlist", icon: Heart, href: "/wishlist" },
    { label: "Addresses", icon: MapPin, href: "/account/addresses" },
  ];

  return (
    <div className="section-padding bg-background-luxury min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="heading-sub">My Account</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            Welcome, {user.name}
          </h1>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white border border-border p-4 space-y-1 md:sticky md:top-24">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 p-3 text-sm transition-colors ${
                      item.active
                        ? "text-gold bg-gold/5 border-l-2 border-gold"
                        : "text-text-secondary hover:text-gold hover:bg-background-luxury"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 text-sm text-error hover:bg-error/10 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="md:col-span-3 space-y-6">
            {/* Stats */}
            {loading ? (
              <div className="bg-white border border-border p-12 text-center">
                <Loader2 size={32} className="animate-spin text-gold mx-auto" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  icon={Package}
                  label="Total Orders"
                  value={stats.orders}
                  href="/account/orders"
                />
                <StatCard
                  icon={Scissors}
                  label="Custom Thobe"
                  value={stats.custom}
                  href="/account/orders"
                />
                <StatCard
                  icon={Heart}
                  label="Wishlist"
                  value={stats.wishlist}
                  href="/wishlist"
                />
              </div>
            )}

            {/* Profile Info */}
            <div className="bg-white border border-border p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl text-charcoal">
                  Profile Information
                </h2>
                <Link
                  href="/account/profile"
                  className="text-xs text-gold hover:text-gold-dark uppercase tracking-widest"
                >
                  Edit →
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <InfoRow label="Name" value={user.name} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Phone" value={user.phone || "Not set"} />
                <InfoRow label="Role" value={user.role} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-border p-6 md:p-8">
              <h2 className="font-serif text-xl text-charcoal mb-5">
                Quick Actions
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <QuickAction
                  href="/account/orders"
                  icon={Package}
                  title="View My Orders"
                  desc="Track your recent orders"
                />
                <QuickAction
                  href="/custom-thobe"
                  icon={Scissors}
                  title="Design Custom Thobe"
                  desc="Create your unique thobe"
                />
                <QuickAction
                  href="/wishlist"
                  icon={Heart}
                  title="My Wishlist"
                  desc="Your saved items"
                />
                <QuickAction
                  href="/account/addresses"
                  icon={MapPin}
                  title="Manage Addresses"
                  desc="Delivery addresses"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, href }) {
  return (
    <Link
      href={href}
      className="bg-white border border-border p-6 hover:border-gold/50 transition-colors group"
    >
      <Icon size={24} className="text-gold mb-3" />
      <p className="font-serif text-3xl text-charcoal mb-1">{value}</p>
      <p className="text-xs uppercase tracking-widest text-text-muted">
        {label}
      </p>
    </Link>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
        {label}
      </p>
      <p className="text-sm text-charcoal capitalize">{value}</p>
    </div>
  );
}

function QuickAction({ href, icon: Icon, title, desc }) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 p-4 border border-border hover:border-gold/50 hover:bg-background-luxury transition-colors group"
    >
      <div className="w-10 h-10 bg-gold/10 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-gold" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-charcoal group-hover:text-gold transition-colors">
          {title}
        </p>
        <p className="text-xs text-text-muted">{desc}</p>
      </div>
    </Link>
  );
}
