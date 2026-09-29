"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Package,
  FolderTree,
  Star,
  ShoppingBag,
  Scissors,
  Mail,
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    pendingReviews: 0,
    orders: 0,
    customOrders: 0,
    subscribers: 0,
  });
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [reviews, products, categories, subs, orders] = await Promise.allSettled([
        axios.get("/api/admin/reviews?status=pending"),
        axios.get("/api/products?limit=1"),
        axios.get("/api/categories"),
        axios.get("/api/newsletter"),
        axios.get("/api/orders"),
      ]);

      setStats({
        products:
          products.status === "fulfilled"
            ? products.value.data.data.pagination?.total || 0
            : 0,
        categories:
          categories.status === "fulfilled"
            ? categories.value.data.data.categories?.length || 0
            : 0,
        pendingReviews:
          reviews.status === "fulfilled"
            ? reviews.value.data.data.reviews?.length || 0
            : 0,
        subscribers:
          subs.status === "fulfilled"
            ? subs.value.data.data.subscribers?.length || 0
            : 0,
        orders:
          orders.status === "fulfilled"
            ? orders.value.data.data.orders?.length || 0
            : 0,
        customOrders:
          orders.status === "fulfilled"
            ? orders.value.data.data.customDesigns?.length || 0
            : 0,
      });

      if (reviews.status === "fulfilled") {
        setRecentReviews(reviews.value.data.data.reviews?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: "Products", value: stats.products, icon: Package, href: "/admin/products", color: "text-info" },
    { label: "Categories", value: stats.categories, icon: FolderTree, href: "/admin/categories", color: "text-purple-500" },
    { label: "Pending Reviews", value: stats.pendingReviews, icon: Star, href: "/admin/reviews", color: "text-warning" },
    { label: "Orders", value: stats.orders, icon: ShoppingBag, href: "/admin/orders", color: "text-success" },
    { label: "Custom Orders", value: stats.customOrders, icon: Scissors, href: "/admin/custom-orders", color: "text-gold" },
    { label: "Subscribers", value: stats.subscribers, icon: Mail, href: "/admin/newsletter", color: "text-error" },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-gold mb-1">Overview</p>
        <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
          Dashboard
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-border p-5 animate-pulse">
              <div className="h-6 w-6 bg-gray-200 mb-3" />
              <div className="h-8 bg-gray-200 mb-2" />
              <div className="h-3 bg-gray-200 w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className="bg-white border border-border p-5 hover:border-gold/50 transition-colors"
              >
                <Icon size={20} className={`${card.color} mb-3`} />
                <p className="font-serif text-3xl text-charcoal mb-1">
                  {card.value}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-text-muted">
                  {card.label}
                </p>
              </Link>
            );
          })}
        </div>
      )}

      <div className="bg-white border border-border">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg text-charcoal">Pending Reviews</h2>
            <p className="text-xs text-text-muted">Requires your approval</p>
          </div>
          <Link
            href="/admin/reviews"
            className="text-xs uppercase tracking-widest text-gold hover:text-gold-dark"
          >
            View All →
          </Link>
        </div>

        {recentReviews.length === 0 ? (
          <div className="p-12 text-center">
            <Star size={40} className="text-border mx-auto mb-3" />
            <p className="text-sm text-text-muted">No pending reviews</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentReviews.map((review) => (
              <div
                key={review._id}
                className="p-5 flex items-start gap-4 hover:bg-background-luxury"
              >
                <div className="flex shrink-0 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < review.rating ? "fill-gold text-gold" : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-charcoal line-clamp-2">
                    {review.comment}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    By {review.user?.name || "Unknown"} •{" "}
                    {review.product?.name || "Unknown Product"}
                  </p>
                </div>
                <Link
                  href="/admin/reviews"
                  className="text-xs text-gold hover:underline shrink-0"
                >
                  Review →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
