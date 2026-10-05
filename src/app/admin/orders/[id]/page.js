"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "@/lib/toast";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Mail,
  Truck,
  CheckCircle,
  Clock,
  Loader2,
  Save,
  Printer,
  User,
  Smartphone,
  Copy,
  AlertCircle,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_OPTIONS = [
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "out_for_delivery", label: "Out for Delivery" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const STATUS_STEPS = [
  { id: "pending", label: "Order Placed", icon: Clock },
  { id: "confirmed", label: "Confirmed", icon: CheckCircle },
  { id: "processing", label: "Processing", icon: Package },
  { id: "shipped", label: "Shipped", icon: Truck },
  { id: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { id: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/orders/${id}`);
      setOrder(data.data.order);
      setStatus(data.data.order.orderStatus);
      setTrackingNumber(data.data.order.trackingNumber || "");
      setPaymentStatus(data.data.order.paymentStatus);
      setNotes(data.data.order.notes || "");
    } catch (error) {
      toast.error("Order not found");
      router.push("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.patch(`/api/admin/orders/${id}`, {
        orderStatus: status,
        trackingNumber,
        paymentStatus,
        notes,
      });
      toast.success("Order updated");
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const handleVerifyPayment = async () => {
    try {
      await axios.patch(`/api/admin/orders/${id}`, {
        paymentStatus: "paid",
      });
      toast.success("Payment verified & marked as Paid");
      fetchOrder();
    } catch (error) {
      toast.error("Verification failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={40} className="animate-spin text-gold" />
      </div>
    );
  }

  if (!order) return null;

  const currentStatusIdx = STATUS_STEPS.findIndex((s) => s.id === order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";
  const isMobilePayment =
    order.paymentMethod === "bkash" || order.paymentMethod === "nagad";
  const needsVerification =
    isMobilePayment && order.paymentStatus === "pending" && order.paymentTransactionId;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 border border-border hover:border-gold transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-widest text-gold mb-1">
              Manage Order
            </p>
            <h1 className="font-serif text-2xl text-charcoal">
              #{order.orderNumber}
            </h1>
            <p className="text-xs text-text-muted mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="btn-outline text-xs py-2.5 px-4 flex items-center gap-2"
        >
          <Printer size={14} /> Print
        </button>
      </div>

      {/* 🚨 PAYMENT VERIFICATION ALERT */}
      {needsVerification && (
        <div className="mb-6 bg-warning/10 border-2 border-warning p-5 flex items-start gap-4">
          <AlertCircle size={24} className="text-warning shrink-0" />
          <div className="flex-1">
            <p className="font-serif text-lg text-charcoal mb-1">
              Payment Verification Required
            </p>
            <p className="text-xs text-text-secondary mb-3">
              Customer submitted {order.paymentMethod === "bkash" ? "bKash" : "Nagad"} payment.
              Verify the transaction and mark as paid.
            </p>
            <div className="grid md:grid-cols-2 gap-3 bg-white p-3 border border-warning/30 mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                  Transaction ID
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-charcoal font-bold">
                    {order.paymentTransactionId}
                  </p>
                  <button
                    onClick={() => copyToClipboard(order.paymentTransactionId)}
                    className="p-1 text-text-muted hover:text-gold"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>
              {order.senderNumber && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                    Sender Number
                  </p>
                  <p className="font-mono text-sm text-charcoal font-bold">
                    {order.senderNumber}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleVerifyPayment}
              className="bg-success hover:bg-success/90 text-white text-xs uppercase tracking-widest py-2.5 px-5 flex items-center gap-2"
            >
              <CheckCircle size={14} /> Mark as Paid
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          {!isCancelled && (
            <div className="bg-white border border-border p-6">
              <h2 className="font-serif text-lg text-charcoal mb-5">
                Order Progress
              </h2>
              <div className="relative">
                <div className="flex items-center justify-between">
                  {STATUS_STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = idx <= currentStatusIdx;
                    const isCurrent = idx === currentStatusIdx;
                    return (
                      <div
                        key={step.id}
                        className="flex-1 flex flex-col items-center relative"
                      >
                        {idx > 0 && (
                          <div
                            className={`absolute top-4 h-0.5 w-full -left-1/2 ${
                              idx <= currentStatusIdx ? "bg-gold" : "bg-border"
                            }`}
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

          {/* Payment Info */}
          <div className="bg-white border border-border p-6">
            <h2 className="font-serif text-lg text-charcoal mb-4 flex items-center gap-2">
              <Smartphone size={16} className="text-gold" />
              Payment Information
            </h2>
            <div className="space-y-3 text-sm">
              <Row label="Method" value={order.paymentMethod?.toUpperCase()} />
              <Row
                label="Status"
                value={
                  <span
                    className={`px-2 py-0.5 text-xs uppercase tracking-widest ${
                      order.paymentStatus === "paid"
                        ? "bg-success/10 text-success"
                        : order.paymentStatus === "failed"
                        ? "bg-error/10 text-error"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                }
              />
              {order.paymentTransactionId && (
                <Row
                  label="Transaction ID"
                  value={
                    <span className="font-mono text-xs">
                      {order.paymentTransactionId}
                    </span>
                  }
                />
              )}
              {order.senderNumber && (
                <Row label="Sender Number" value={order.senderNumber} />
              )}
              {order.paymentVerifiedAt && (
                <Row
                  label="Verified"
                  value={formatDate(order.paymentVerifiedAt)}
                />
              )}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white border border-border p-6">
            <h2 className="font-serif text-lg text-charcoal mb-5">
              Items ({order.items.length})
            </h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal">
                      {item.name}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-text-muted mt-1">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <p className="text-sm text-charcoal font-medium shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="bg-white border border-border p-6">
            <h2 className="font-serif text-lg text-charcoal mb-4">
              Price Breakdown
            </h2>
            <div className="space-y-2 text-sm">
              <Row label="Subtotal" value={formatPrice(order.subtotal)} />
              <Row label="Shipping" value={formatPrice(order.shippingCharge)} />
              <div className="border-t border-border pt-3 flex justify-between items-center">
                <span className="font-serif text-base text-charcoal">Total</span>
                <span className="font-serif text-2xl text-gold">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* History */}
          {order.statusHistory?.length > 0 && (
            <div className="bg-white border border-border p-6">
              <h2 className="font-serif text-lg text-charcoal mb-4">
                Status History
              </h2>
              <div className="space-y-3">
                {[...order.statusHistory].reverse().map((h, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gold mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-charcoal capitalize">
                        {h.status?.replace(/_/g, " ")}
                      </p>
                      {h.note && (
                        <p className="text-xs text-text-muted">{h.note}</p>
                      )}
                      <p className="text-[10px] text-text-muted mt-1">
                        {formatDate(h.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-border p-6 sticky top-24">
            <h2 className="font-serif text-lg text-charcoal mb-4">
              Update Order
            </h2>

            <div className="mb-4">
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-2 block">
                Order Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 border border-border focus:border-gold outline-none text-sm bg-white"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-2 block">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3 py-2.5 border border-border focus:border-gold outline-none text-sm bg-white"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-2 block">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g., SND-12345"
                className="w-full px-3 py-2.5 border border-border focus:border-gold outline-none text-sm"
              />
            </div>

            <div className="mb-5">
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-2 block">
                Internal Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-border focus:border-gold outline-none text-sm resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Customer */}
          <div className="bg-white border border-border p-6">
            <h2 className="font-serif text-lg text-charcoal mb-4 flex items-center gap-2">
              <User size={16} className="text-gold" /> Customer
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                  Name
                </p>
                <p className="text-charcoal">{order.customerInfo?.name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                  Phone
                </p>
                <p className="text-charcoal flex items-center gap-2">
                  <Phone size={12} /> {order.customerInfo?.phone}
                </p>
              </div>
              {order.customerInfo?.email && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                    Email
                  </p>
                  <p className="text-charcoal flex items-center gap-2 break-all">
                    <Mail size={12} /> {order.customerInfo.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white border border-border p-6">
            <h2 className="font-serif text-lg text-charcoal mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-gold" /> Shipping
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {order.shippingAddress?.address}
              {order.shippingAddress?.area && `, ${order.shippingAddress.area}`}
              {order.shippingAddress?.upazila && `, ${order.shippingAddress.upazila}`}
              {order.shippingAddress?.district && `, ${order.shippingAddress.district}`}
              {order.shippingAddress?.division && `, ${order.shippingAddress.division}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-text-secondary text-sm">{label}</span>
      <span className="text-charcoal text-sm text-right">{value}</span>
    </div>
  );
}
