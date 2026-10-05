"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "@/lib/toast";
import {
  Package,
  Scissors,
  Calendar,
  Eye,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { formatPrice, formatDate } from "@/lib/utils";

export default function OrdersPage() {
  const router = useRouter();
  const { user, initialized } = useAuthStore();
  const [data, setData] = useState({ orders: [], customDesigns: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("orders");

  useEffect(() => {
    if (initialized && !user) {
      router.push("/login?redirect=/account/orders");
    }
  }, [initialized, user, router]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/orders");
      setData({
        orders: data.data.orders || [],
        customDesigns: data.data.customDesigns || [],
      });
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (!initialized || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background-luxury">
        <Loader2 size={40} className="animate-spin text-gold" />
      </div>
    );
  }

  const currentList = tab === "orders" ? data.orders : data.customDesigns;

  return (
    <div className="min-h-screen bg-background-luxury">
      <div className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="text-xs text-text-muted mb-3 flex items-center gap-2">
            <Link href="/account" className="hover:text-gold">My Account</Link>
            <span>/</span>
            <span className="text-charcoal">My Orders</span>
          </nav>
          <p className="heading-sub">Order History</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            My Orders
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 bg-white border border-border p-1.5">
          <button
            onClick={() => setTab("orders")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-widest transition-colors ${
              tab === "orders"
                ? "bg-charcoal text-white"
                : "text-text-secondary hover:text-charcoal"
            }`}
          >
            <Package size={14} /> Regular Orders ({data.orders.length})
          </button>
          <button
            onClick={() => setTab("custom")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-widest transition-colors ${
              tab === "custom"
                ? "bg-charcoal text-white"
                : "text-text-secondary hover:text-charcoal"
            }`}
          >
            <Scissors size={14} /> Custom Thobe ({data.customDesigns.length})
          </button>
        </div>

        {/* Empty State */}
        {currentList.length === 0 ? (
          <div className="bg-white border border-border p-12 text-center">
            {tab === "orders" ? (
              <>
                <Package size={48} className="text-border mx-auto mb-4" />
                <h3 className="font-serif text-xl text-charcoal mb-2">
                  No Orders Yet
                </h3>
                <p className="text-sm text-text-secondary mb-6">
                  You haven't placed any orders yet.
                </p>
                <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
                  <ShoppingBag size={14} /> Start Shopping
                </Link>
              </>
            ) : (
              <>
                <Scissors size={48} className="text-border mx-auto mb-4" />
                <h3 className="font-serif text-xl text-charcoal mb-2">
                  No Custom Thobe Designs
                </h3>
                <p className="text-sm text-text-secondary mb-6">
                  Design your own custom thobe today!
                </p>
                <Link href="/custom-thobe" className="btn-primary inline-flex items-center gap-2">
                  <Scissors size={14} /> Design Custom Thobe
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {tab === "orders"
              ? data.orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))
              : data.customDesigns.map((design) => (
                  <CustomDesignCard key={design._id} design={design} />
                ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const statusColors = {
    pending: "bg-warning/10 text-warning border-warning/30",
    confirmed: "bg-info/10 text-info border-info/30",
    processing: "bg-info/10 text-info border-info/30",
    shipped: "bg-gold/10 text-gold border-gold/30",
    delivered: "bg-success/10 text-success border-success/30",
    cancelled: "bg-error/10 text-error border-error/30",
  };

  return (
    <div className="bg-white border border-border p-5 hover:border-gold/40 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
            Order #
          </p>
          <p className="font-mono text-sm text-charcoal font-medium">
            {order.orderNumber}
          </p>
          <div className="flex items-center gap-3 text-xs text-text-muted mt-2">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {formatDate(order.createdAt)}
            </span>
            <span>{order.items?.length || 0} items</span>
          </div>
        </div>
        <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 border ${statusColors[order.orderStatus] || statusColors.pending}`}>
          {order.orderStatus}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Total</p>
          <p className="font-serif text-lg text-charcoal">{formatPrice(order.total)}</p>
        </div>
        <Link href={`/account/orders/${order._id}`} className="btn-outline text-xs py-2 px-4 flex items-center gap-1">
          <Eye size={12} /> View Details
        </Link>
      </div>
    </div>
  );
}

function CustomDesignCard({ design }) {
  const config = design.config || {};
  const status = design.isOrdered ? "Ordered" : "Saved Design";

  return (
    <div className="bg-white border border-border hover:border-gold/40 transition-colors overflow-hidden">
      <div className="grid md:grid-cols-4 gap-4 p-5">
        <div className="md:col-span-1">
          <div className="aspect-[3/4] bg-background-luxury border border-border flex items-center justify-center">
            {design.previewImage ? (
              <img src={design.previewImage} alt="Custom" className="w-full h-full object-cover" />
            ) : (
              <Scissors size={32} className="text-gold/40" />
            )}
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Design ID</p>
              <p className="font-mono text-sm text-charcoal font-medium">{design.designId}</p>
              <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                <Calendar size={11} /> {formatDate(design.createdAt)}
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 border bg-info/10 text-info border-info/30">
              {status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-4">
            <ConfigItem label="Fabric" value={config.fabric} />
            <ConfigItem label="Color" value={config.fabricColor} />
            <ConfigItem label="Collar" value={config.collarType} />
            <ConfigItem label="Fit" value={config.fit} />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-muted">Price</p>
              <p className="font-serif text-lg text-charcoal">{formatPrice(design.totalPrice)}</p>
            </div>
            <Link href={`/custom-thobe?design=${design.designId}`} className="btn-outline text-xs py-2 px-3 flex items-center gap-1">
              <Eye size={12} /> View / Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfigItem({ label, value }) {
  if (!value) return null;
  return (
    <div className="p-2 bg-background-luxury border border-border">
      <p className="text-[9px] uppercase tracking-widest text-text-muted">{label}</p>
      <p className="text-xs text-charcoal font-medium capitalize truncate">{value}</p>
    </div>
  );
}
