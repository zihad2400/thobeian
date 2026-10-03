"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Trash2,
  Loader2,
  TrendingUp,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_TABS = [
  { id: "all", label: "All Orders" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
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
  const [deleting, setDeleting] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

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

  const handleDelete = async (id, orderNumber) => {
    if (!confirm(`Delete order ${orderNumber}?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(id);
      const { data } = await axios.delete(`/api/admin/orders/${id}`);
      toast.success(data.message || "Order deleted");
      setOrders(orders.filter((o) => o._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  // Filter
  const filtered = orders.filter((order) => {
    if (tab !== "all" && order.orderStatus !== tab) return false;

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
    processing: orders.filter((o) =>
      ["confirmed", "processing", "shipped"].includes(o.orderStatus)
    ).length,
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
          Track, manage, and delete customer orders
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

      {/* Search */}
      <div className="bg-white border border-border p-4 mb-6 rounded-2xl">
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
              className="w-full pl-10 pr-4 py-2.5 border border-border focus:border-gold outline-none text-sm rounded-full"
            />
          </div>
          <button
            onClick={fetchOrders}
            className="btn-outline text-xs py-2.5 px-4 flex items-center gap-2 whitespace-nowrap rounded-full"
          >
            <Loader2 size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-border p-1.5 mb-6 flex items-center gap-1 overflow-x-auto rounded-2xl">
        {STATUS_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs uppercase tracking-widest whitespace-nowrap transition-colors rounded-full ${
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
        <div className="bg-white border border-border p-12 text-center rounded-2xl">
          <Loader2 size={32} className="animate-spin text-gold mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border p-12 text-center rounded-2xl">
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
              className="bg-white border border-border hover:border-gold/40 transition-colors rounded-2xl"
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                {/* Order Info */}
                <div className="md:w-44 shrink-0">
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
                <div className="md:w-20 shrink-0">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                    Items
                  </p>
                  <p className="text-sm text-charcoal">
                    {order.items?.length || 0}
                  </p>
                </div>

                {/* Total */}
                <div className="md:w-28 shrink-0">
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
                    className={`inline-block text-[10px] uppercase tracking-widest px-2.5 py-1 border rounded-full ${
                      STATUS_COLORS[order.orderStatus]
                    }`}
                  >
                    {order.orderStatus?.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 whitespace-nowrap rounded-full"
                  >
                    <Eye size={14} /> Manage
                  </Link>

                  <button
                    onClick={() => handleDelete(order._id, order.orderNumber)}
                    disabled={deleting === order._id}
                    className="p-2.5 border border-error/30 text-error hover:bg-error hover:text-white transition-colors rounded-full disabled:opacity-50"
                    title="Delete Order"
                  >
                    {deleting === order._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
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
    <div className="bg-white border border-border p-5 rounded-2xl">
      <Icon size={20} className={`${color} mb-3`} />
      <p className="font-serif text-2xl text-charcoal mb-1 truncate">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-text-muted">
        {label}
      </p>
    </div>
  );
}
