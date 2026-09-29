"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Download,
  TrendingUp,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_TABS = [
  { id: "all", label: "All Orders", color: "text-charcoal" },
  { id: "pending", label: "Pending", color: "text-warning" },
  { id: "confirmed", label: "Confirmed", color: "text-info" },
  { id: "processing", label: "Processing", color: "text-info" },
  { id: "shipped", label: "Shipped", color: "text-gold" },
  { id: "delivered", label: "Delivered", color: "text-success" },
  { id: "cancelled", label: "Cancelled", color: "text-error" },
];

const STATUS_COLORS = {
  pending: "bg-warning/10 text-warning border-warning/30",
  confirmed: "bg-info/10 text-info border-info/30",
  processing: "bg-info/10 text-info border-info/30",
  shipped: "bg-gold/10 text-gold border-gold/30",
  out_for_delivery: "bg-gold/10 text-gold border-gold/30",
  delivered: "bg-success/10 text-success border-success/30",
  cancelled: "bg-error/10 text-error border-error/30",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/orders?status=all");
      setOrders(data.data.orders || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter
  const filtered = orders.filter((order) => {
    // Tab filter
    if (tab !== "all" && order.orderStatus !== tab) return false;

    // Search filter
    if (search.trim()) {
      const s = search.toLowerCase();
      return (
        order.orderNumber?.toLowerCase().includes(s) ||
        order.customerInfo?.name?.toLowerCase().includes(s) ||
        order.customerInfo?.phone?.includes(s) ||
        order.customerInfo?.email?.toLowerCase().includes(s)
      );
    }

    return true;
  });

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus === "pending").length,
    processing: orders.filter(
      (o) => ["confirmed", "processing", "shipped"].includes(o.orderStatus)
    ).length,
    delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    revenue: orders
      .filter((o) => o.orderStatus !== "cancelled")
      .reduce((sum, o) => sum + (o.total || 0), 0),
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-gold mb-1">
          Manage
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
          Orders
        </h1>
        <p className="text-sm text-text-muted mt-2">
          Track and manage all customer orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats.total}
          color="text-info"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={stats.pending}
          color="text-warning"
        />
        <StatCard
          icon={Truck}
          label="In Progress"
          value={stats.processing}
          color="text-gold"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value={formatPrice(stats.revenue)}
          color="text-success"
        />
      </div>

      {/* Search + Filter */}
      <div className="bg-white border border-border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search order number, customer, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border focus:border-gold outline-none text-sm"
            />
          </div>
          <button
            onClick={fetchOrders}
            className="btn-outline text-xs py-2.5 px-4 flex items-center gap-2 whitespace-nowrap"
          >
            <Loader2 size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-border p-1.5 mb-6 flex items-center gap-1 overflow-x-auto">
        {STATUS_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${
              tab === t.id
                ? "bg-charcoal text-white"
                : "text-text-secondary hover:text-charcoal"
            }`}
          >
            {t.label} (
            {t.id === "all"
              ? orders.length
              : orders.filter((o) => o.orderStatus === t.id).length}
            )
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="bg-white border border-border p-12 text-center">
          <Loader2 size={32} className="animate-spin text-gold mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border p-12 text-center">
          <Package size={48} className="text-border mx-auto mb-4" />
          <p className="text-sm text-text-muted">
            {search ? "No matching orders" : "No orders found"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-border hover:border-gold/40 transition-colors"
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                {/* Order Info */}
                <div className="md:w-48 shrink-0">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                    Order
                  </p>
                  <p className="font-mono text-sm text-charcoal font-medium">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                {/* Customer */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                    Customer
                  </p>
                  <p className="text-sm text-charcoal font-medium truncate">
                    {order.customerInfo?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {order.customerInfo?.phone}
                  </p>
                </div>

                {/* Items */}
                <div className="md:w-24 shrink-0">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                    Items
                  </p>
                  <p className="text-sm text-charcoal">
                    {order.items?.length || 0}
                  </p>
                </div>

                {/* Total */}
                <div className="md:w-32 shrink-0">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                    Total
                  </p>
                  <p className="font-serif text-lg text-charcoal">
                    {formatPrice(order.total)}
                  </p>
                </div>

                {/* Status */}
                <div className="md:w-32 shrink-0">
                  <span
                    className={`inline-block text-[10px] uppercase tracking-widest px-2.5 py-1 border ${
                      STATUS_COLORS[order.orderStatus]
                    }`}
                  >
                    {order.orderStatus?.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Actions */}
                <div className="md:w-auto shrink-0">
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Eye size={14} /> Manage
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-border p-5">
      <Icon size={20} className={`${color} mb-3`} />
      <p className="font-serif text-2xl text-charcoal mb-1 truncate">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-text-muted">
        {label}
      </p>
    </div>
  );
}
