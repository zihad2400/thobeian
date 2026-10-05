"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "@/lib/toast";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_STEPS = [
  { id: "pending", label: "Order Placed", icon: Clock },
  { id: "confirmed", label: "Confirmed", icon: CheckCircle },
  { id: "processing", label: "Processing", icon: Package },
  { id: "shipped", label: "Shipped", icon: Truck },
  { id: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { id: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${id}`);
      setOrder(data.data.order);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Order not found");
        router.push("/account/orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel this order?")) return;
    try {
      setCancelling(true);
      await axios.patch(`/api/orders/${id}`, { action: "cancel" });
      toast.success("Order cancelled");
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot cancel");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background-luxury">
        <Loader2 size={40} className="animate-spin text-gold" />
      </div>
    );
  }

  if (!order) return null;

  const currentStatusIdx = STATUS_STEPS.findIndex((s) => s.id === order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";

  const statusColors = {
    pending: "bg-warning/10 text-warning border-warning/30",
    confirmed: "bg-info/10 text-info border-info/30",
    processing: "bg-info/10 text-info border-info/30",
    shipped: "bg-gold/10 text-gold border-gold/30",
    out_for_delivery: "bg-gold/10 text-gold border-gold/30",
    delivered: "bg-success/10 text-success border-success/30",
    cancelled: "bg-error/10 text-error border-error/30",
  };

  return (
    <div className="min-h-screen bg-background-luxury">
      <div className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="text-xs text-text-muted mb-3 flex items-center gap-2 flex-wrap">
            <Link href="/account" className="hover:text-gold">My Account</Link>
            <span>/</span>
            <Link href="/account/orders" className="hover:text-gold">My Orders</Link>
            <span>/</span>
            <span className="text-charcoal">{order.orderNumber}</span>
          </nav>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="heading-sub">Order Details</p>
              <h1 className="font-serif text-2xl md:text-3xl text-charcoal">
                #{order.orderNumber}
              </h1>
              <p className="text-xs text-text-muted mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <span
              className={`text-[10px] uppercase tracking-widest px-3 py-1.5 border ${
                statusColors[order.orderStatus]
              }`}
            >
              {order.orderStatus?.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Tracking Timeline */}
        {!isCancelled && (
          <div className="bg-white border border-border p-6">
            <h2 className="font-serif text-lg text-charcoal mb-5">
              Order Tracking
            </h2>

            <div className="relative">
              <div className="flex items-center justify-between">
                {STATUS_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx <= currentStatusIdx;
                  const isCurrent = idx === currentStatusIdx;
                  return (
                    <div key={step.id} className="flex-1 flex flex-col items-center relative">
                      {idx > 0 && (
                        <div
                          className={`absolute top-4 right-1/2 w-full h-0.5 ${
                            idx <= currentStatusIdx ? "bg-gold" : "bg-border"
                          }`}
                          style={{ right: "50%", left: "-50%" }}
                        />
                      )}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                          isActive
                            ? isCurrent
                              ? "bg-gold text-white"
                              : "bg-gold/20 text-gold"
                            : "bg-white border-2 border-border text-border"
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      <p
                        className={`text-[10px] mt-2 text-center uppercase tracking-widest ${
                          isActive ? "text-charcoal" : "text-text-muted"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Cancelled */}
        {isCancelled && (
          <div className="bg-error/5 border border-error/30 p-6 flex items-center gap-3">
            <XCircle size={24} className="text-error shrink-0" />
            <div>
              <p className="font-medium text-charcoal">Order Cancelled</p>
              <p className="text-xs text-text-muted">
                This order has been cancelled
              </p>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="bg-white border border-border p-6">
          <h2 className="font-serif text-lg text-charcoal mb-5">
            Items ({order.items.length})
          </h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {item.size && `Size: ${item.size}`}
                    {item.color && ` • ${item.color}`}
                  </p>
                  <p className="text-xs text-text-muted">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-charcoal shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-border p-6">
            <h3 className="font-serif text-lg text-charcoal mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-gold" /> Shipping Address
            </h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-charcoal">
                {order.customerInfo.name}
              </p>
              <p className="text-text-secondary flex items-center gap-2">
                <Phone size={12} /> {order.customerInfo.phone}
              </p>
              {order.customerInfo.email && (
                <p className="text-text-secondary flex items-center gap-2">
                  <Mail size={12} /> {order.customerInfo.email}
                </p>
              )}
              <p className="text-text-secondary leading-relaxed pt-2">
                {order.shippingAddress.address}
                {order.shippingAddress.area && `, ${order.shippingAddress.area}`}
                {order.shippingAddress.district && `, ${order.shippingAddress.district}`}
                {order.shippingAddress.division && `, ${order.shippingAddress.division}`}
              </p>
            </div>
          </div>

          <div className="bg-white border border-border p-6">
            <h3 className="font-serif text-lg text-charcoal mb-4">
              Payment & Delivery
            </h3>
            <div className="space-y-3 text-sm">
              <Row label="Payment Method" value={order.paymentMethod?.toUpperCase()} />
              <Row
                label="Payment Status"
                value={
                  <span className={`px-2 py-0.5 text-xs ${order.paymentStatus === "paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                    {order.paymentStatus}
                  </span>
                }
              />
              <Row
                label="Delivery"
                value={order.deliveryMethod?.replace(/_/g, " ")}
              />
              {order.trackingNumber && (
                <Row label="Tracking" value={order.trackingNumber} />
              )}
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white border border-border p-6">
          <h3 className="font-serif text-lg text-charcoal mb-4">
            Price Breakdown
          </h3>
          <div className="space-y-2 text-sm">
            <Row label="Subtotal" value={formatPrice(order.subtotal)} />
            <Row label="Shipping" value={formatPrice(order.shippingCharge)} />
            {order.codFee > 0 && <Row label="COD Fee" value={formatPrice(order.codFee)} />}
            {order.discount > 0 && (
              <Row label="Discount" value={`- ${formatPrice(order.discount)}`} />
            )}
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-serif text-base text-charcoal">Total</span>
              <span className="font-serif text-2xl text-gold">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {order.orderStatus === "pending" || order.orderStatus === "confirmed" ? (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full text-sm text-error hover:bg-error/10 py-3 border border-error/30 transition-colors disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-text-secondary">{label}</span>
      <span className="text-charcoal text-right">{value}</span>
    </div>
  );
}
