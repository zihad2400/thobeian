"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "@/lib/toast";
import {
  MapPin,
  User,
  Truck,
  CreditCard,
  Wallet,
  Loader2,
  Check,
  ChevronRight,
  Smartphone,
  Copy,
  Info,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/lib/utils";

const SHIPPING_OPTIONS = [
  { id: "inside_dhaka", label: "Inside Dhaka", charge: 80, days: "1-2 days" },
  { id: "outside_dhaka", label: "Outside Dhaka", charge: 130, days: "2-4 days" },
  { id: "express", label: "Express Delivery", charge: 200, days: "Same day" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, initialized } = useAuthStore();
  const { items, getSubtotal, fetchCart, clearCart } = useCartStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [paymentConfig, setPaymentConfig] = useState({
    bkashAuto: false,
    nagadAuto: false,
    bkashNumber: "01XXXXXXXXX",
    nagadNumber: "01XXXXXXXXX",
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    division: "",
    district: "",
    upazila: "",
    area: "",
    address: "",
    postalCode: "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState("inside_dhaka");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initialized && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [initialized, user, router]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      }));
      fetchCart().finally(() => setLoading(false));
      fetchPaymentConfig();
    }
  }, [user, fetchCart]);

  const fetchPaymentConfig = async () => {
    try {
      const { data } = await axios.get("/api/payment");
      setPaymentConfig({
        bkashAuto: data.data.bkashAuto || false,
        nagadAuto: data.data.nagadAuto || false,
        bkashNumber: data.data.bkash || "01XXXXXXXXX",
        nagadNumber: data.data.nagad || "01XXXXXXXXX",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const subtotal = getSubtotal();
  const shippingCharge =
    subtotal >= 5000
      ? 0
      : SHIPPING_OPTIONS.find((s) => s.id === deliveryMethod)?.charge || 80;
  const total = subtotal + shippingCharge;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const validateStep1 = () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill name, phone, and address");
      return false;
    }
    return true;
  };

  // ===== Create order =====
  const createOrder = async () => {
    const { data } = await axios.post("/api/orders", {
      customerInfo: {
        name: form.name,
        phone: form.phone,
        email: form.email,
      },
      shippingAddress: {
        division: form.division,
        district: form.district,
        upazila: form.upazila,
        area: form.area,
        address: form.address,
        postalCode: form.postalCode,
      },
      deliveryMethod,
      paymentMethod,
      transactionId:
        paymentMethod === "bkash" && !paymentConfig.bkashAuto
          ? transactionId
          : paymentMethod === "nagad" && !paymentConfig.nagadAuto
          ? transactionId
          : null,
      senderNumber,
      notes,
    });
    return data.data;
  };

  // ===== bKash Auto =====
  const handleBkashAuto = async () => {
    if (!validateStep1()) {
      setStep(1);
      return;
    }
    try {
      setSubmitting(true);
      const orderData = await createOrder();
      const { data: bkashData } = await axios.post(
        "/api/payment/bkash/create",
        {
          amount: total,
          orderId: orderData.orderId,
        }
      );
      if (bkashData.success && bkashData.data.bkashURL) {
        window.location.href = bkashData.data.bkashURL;
      } else {
        toast.error(bkashData.message || "bKash failed");
        setSubmitting(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "bKash failed");
      setSubmitting(false);
    }
  };

  // ===== Nagad Auto =====
  const handleNagadAuto = async () => {
    if (!validateStep1()) {
      setStep(1);
      return;
    }
    try {
      setSubmitting(true);
      const orderData = await createOrder();
      const { data: nagadData } = await axios.post(
        "/api/payment/nagad/create",
        {
          amount: total,
          orderId: orderData.orderId,
        }
      );
      if (nagadData.success && nagadData.data.callBackUrl) {
        window.location.href = nagadData.data.callBackUrl;
      } else {
        toast.error(nagadData.message || "Nagad failed");
        setSubmitting(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Nagad failed");
      setSubmitting(false);
    }
  };

  // ===== Manual payment (COD, bKash manual, Nagad manual) =====
  const handleManualSubmit = async () => {
    if (!validateStep1()) return;

    if (
      (paymentMethod === "bkash" && !paymentConfig.bkashAuto) ||
      (paymentMethod === "nagad" && !paymentConfig.nagadAuto)
    ) {
      if (!transactionId.trim()) {
        toast.error("Please enter Transaction ID");
        return;
      }
    }

    try {
      setSubmitting(true);
      const orderData = await createOrder();
      toast.success("Order placed successfully!");
      await clearCart();
      router.push(`/checkout/success?order=${orderData.orderNumber}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalSubmit = () => {
    if (paymentMethod === "bkash" && paymentConfig.bkashAuto) {
      return handleBkashAuto();
    }
    if (paymentMethod === "nagad" && paymentConfig.nagadAuto) {
      return handleNagadAuto();
    }
    return handleManualSubmit();
  };

  if (!initialized || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background-luxury">
        <Loader2 size={40} className="animate-spin text-gold" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background-luxury px-4">
        <p className="font-serif text-2xl text-charcoal mb-4">Your cart is empty</p>
        <Link href="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  const isBkashAuto = paymentMethod === "bkash" && paymentConfig.bkashAuto;
  const isNagadAuto = paymentMethod === "nagad" && paymentConfig.nagadAuto;
  const isBkashManual = paymentMethod === "bkash" && !paymentConfig.bkashAuto;
  const isNagadManual = paymentMethod === "nagad" && !paymentConfig.nagadAuto;
  const isAutoPayment = isBkashAuto || isNagadAuto;

  const paymentMethods = [
    { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive", icon: Wallet },
    {
      id: "bkash",
      label: "bKash",
      desc: paymentConfig.bkashAuto ? "Automatic payment" : "Send money & submit ID",
      icon: Smartphone,
      auto: paymentConfig.bkashAuto,
    },
    {
      id: "nagad",
      label: "Nagad",
      desc: paymentConfig.nagadAuto ? "Automatic payment" : "Send money & submit ID",
      icon: Smartphone,
      auto: paymentConfig.nagadAuto,
    },
  ];

  return (
    <div className="min-h-screen bg-background-luxury">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-text-muted flex-wrap">
            <Link href="/cart" className="hover:text-gold">Cart</Link>
            <ChevronRight size={12} />
            <span className="text-charcoal">Checkout</span>
            <ChevronRight size={12} />
            <span>Confirmation</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal mt-2">Checkout</h1>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            {[
              { n: 1, label: "Shipping" },
              { n: 2, label: "Payment" },
              { n: 3, label: "Review" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-3">
                <button
                  onClick={() => step > s.n && setStep(s.n)}
                  className={`flex items-center gap-2 text-xs uppercase tracking-widest transition-colors ${
                    step >= s.n ? "text-gold" : "text-text-muted"
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] ${
                    step > s.n ? "bg-gold text-white" : step === s.n ? "border-2 border-gold text-gold" : "border-2 border-border text-text-muted"
                  }`}>
                    {step > s.n ? <Check size={12} /> : s.n}
                  </span>
                  {s.label}
                </button>
                {i < 2 && <ChevronRight size={12} className="text-border" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="bg-white border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <User size={20} className="text-gold" />
                    <h2 className="font-serif text-xl text-charcoal">Contact Information</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Full Name *">
                      <input type="text" name="name" value={form.name} onChange={handleChange} className="input-luxury" />
                    </Field>
                    <Field label="Phone *">
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX" className="input-luxury" />
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="Email">
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="input-luxury" />
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin size={20} className="text-gold" />
                    <h2 className="font-serif text-xl text-charcoal">Shipping Address</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Division"><input type="text" name="division" value={form.division} onChange={handleChange} placeholder="Dhaka" className="input-luxury" /></Field>
                    <Field label="District"><input type="text" name="district" value={form.district} onChange={handleChange} className="input-luxury" /></Field>
                    <Field label="Upazila / Thana"><input type="text" name="upazila" value={form.upazila} onChange={handleChange} className="input-luxury" /></Field>
                    <Field label="Area"><input type="text" name="area" value={form.area} onChange={handleChange} className="input-luxury" /></Field>
                    <div className="md:col-span-2">
                      <Field label="Full Address *">
                        <textarea name="address" value={form.address} onChange={handleChange} rows={3} className="input-luxury resize-none" />
                      </Field>
                    </div>
                    <Field label="Postal Code"><input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} className="input-luxury" /></Field>
                  </div>
                </div>

                <div className="bg-white border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Truck size={20} className="text-gold" />
                    <h2 className="font-serif text-xl text-charcoal">Delivery Method</h2>
                  </div>
                  <div className="space-y-3">
                    {SHIPPING_OPTIONS.map((opt) => (
                      <label key={opt.id} className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                        deliveryMethod === opt.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
                      }`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" checked={deliveryMethod === opt.id} onChange={() => setDeliveryMethod(opt.id)} className="w-4 h-4 accent-gold" />
                          <div>
                            <p className="text-sm font-medium text-charcoal">{opt.label}</p>
                            <p className="text-xs text-text-muted">{opt.days}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-charcoal">{opt.charge === 0 ? "Free" : formatPrice(opt.charge)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={() => { if (validateStep1()) setStep(2); }} className="w-full btn-primary py-4 text-sm uppercase tracking-widest">
                  Continue to Payment →
                </button>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div className="bg-white border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard size={20} className="text-gold" />
                    <h2 className="font-serif text-xl text-charcoal">Payment Method</h2>
                  </div>
                  <div className="space-y-3">
                    {paymentMethods.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <label key={opt.id} className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                          paymentMethod === opt.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
                        }`}>
                          <input type="radio" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="w-4 h-4 accent-gold" />
                          <Icon size={18} className="text-gold shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-charcoal">{opt.label}</p>
                              {opt.auto && <span className="text-[9px] uppercase tracking-widest bg-success text-white px-1.5 py-0.5">Auto</span>}
                            </div>
                            <p className="text-xs text-text-muted">{opt.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* bKash AUTO Info */}
                {isBkashAuto && (
                  <div className="bg-pink-50 border border-pink-300 p-5">
                    <p className="text-sm font-medium text-charcoal mb-2">Automatic bKash Payment</p>
                    <p className="text-xs text-text-secondary mb-3">You'll be redirected to bKash to complete payment.</p>
                    <ol className="text-xs text-text-secondary space-y-1 list-decimal list-inside">
                      <li>Click "Pay with bKash"</li>
                      <li>Login to bKash</li>
                      <li>Enter PIN</li>
                      <li>Auto-confirm order</li>
                    </ol>
                  </div>
                )}

                {/* bKash MANUAL */}
                {isBkashManual && (
                  <div className="bg-white border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[#E2136E] text-white flex items-center justify-center font-bold">bK</div>
                      <div>
                        <h3 className="font-serif text-lg text-charcoal">Manual bKash Payment</h3>
                        <p className="text-xs text-text-muted">Send money & submit Transaction ID</p>
                      </div>
                    </div>

                    <div className="bg-pink-50 border-2 border-pink-500 border-dashed p-4 mb-4">
                      <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Send Money To</p>
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <p className="font-mono text-2xl text-charcoal font-bold">{paymentConfig.bkashNumber}</p>
                        <button type="button" onClick={() => copyToClipboard(paymentConfig.bkashNumber)} className="px-3 py-2 text-xs uppercase tracking-widest text-white bg-[#E2136E] hover:bg-[#c21062] flex items-center gap-1.5">
                          <Copy size={12} /> Copy
                        </button>
                      </div>
                      <p className="text-xs text-text-muted mt-2">Amount: <strong className="text-charcoal">{formatPrice(total)}</strong></p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Your bKash Number">
                        <input type="tel" value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} placeholder="01XXXXXXXXX" className="input-luxury" />
                      </Field>
                      <Field label="Transaction ID *">
                        <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value.toUpperCase())} placeholder="e.g., 8N7A2B3C4D" className="input-luxury font-mono uppercase" />
                      </Field>
                    </div>
                  </div>
                )}

                {/* Nagad AUTO Info */}
                {isNagadAuto && (
                  <div className="bg-orange-50 border border-orange-300 p-5">
                    <p className="text-sm font-medium text-charcoal mb-2">Automatic Nagad Payment</p>
                    <p className="text-xs text-text-secondary mb-3">You'll be redirected to Nagad to complete payment.</p>
                    <ol className="text-xs text-text-secondary space-y-1 list-decimal list-inside">
                      <li>Click "Pay with Nagad"</li>
                      <li>Login to Nagad</li>
                      <li>Enter PIN</li>
                      <li>Auto-confirm order</li>
                    </ol>
                  </div>
                )}

                {/* Nagad MANUAL */}
                {isNagadManual && (
                  <div className="bg-white border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-500 text-white flex items-center justify-center font-bold">N</div>
                      <div>
                        <h3 className="font-serif text-lg text-charcoal">Manual Nagad Payment</h3>
                        <p className="text-xs text-text-muted">Send money & submit Transaction ID</p>
                      </div>
                    </div>

                    <div className="bg-orange-50 border-2 border-orange-500 border-dashed p-4 mb-4">
                      <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Send Money To</p>
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <p className="font-mono text-2xl text-charcoal font-bold">{paymentConfig.nagadNumber}</p>
                        <button type="button" onClick={() => copyToClipboard(paymentConfig.nagadNumber)} className="px-3 py-2 text-xs uppercase tracking-widest text-white bg-orange-500 hover:bg-orange-600 flex items-center gap-1.5">
                          <Copy size={12} /> Copy
                        </button>
                      </div>
                      <p className="text-xs text-text-muted mt-2">Amount: <strong className="text-charcoal">{formatPrice(total)}</strong></p>
                    </div>

                    <ol className="text-xs text-text-secondary space-y-1.5 mb-5 list-decimal list-inside bg-background-luxury p-4 border border-border">
                      <li>Open <strong>Nagad app</strong> or dial <strong>*167#</strong></li>
                      <li>Select <strong>Send Money</strong></li>
                      <li>Enter number: <strong className="text-charcoal">{paymentConfig.nagadNumber}</strong></li>
                      <li>Enter amount: <strong className="text-charcoal">{formatPrice(total)}</strong></li>
                      <li>Enter PIN</li>
                      <li>Copy <strong>Transaction ID</strong> from SMS</li>
                    </ol>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Your Nagad Number">
                        <input type="tel" value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} placeholder="01XXXXXXXXX" className="input-luxury" />
                      </Field>
                      <Field label="Transaction ID *">
                        <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value.toUpperCase())} placeholder="e.g., NGD123456" className="input-luxury font-mono uppercase" />
                      </Field>
                    </div>
                  </div>
                )}

                {/* COD Info */}
                {paymentMethod === "cod" && (
                  <div className="bg-success/5 border border-success/30 p-4 flex items-start gap-3">
                    <Wallet size={20} className="text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-charcoal">Cash on Delivery</p>
                      <p className="text-xs text-text-muted">You'll pay {formatPrice(total)} in cash when you receive the order.</p>
                    </div>
                  </div>
                )}

                <div className="bg-white border border-border p-6">
                  <Field label="Order Notes (optional)">
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Any special instruction..." className="input-luxury resize-none" />
                  </Field>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline py-4 px-6 text-sm">← Back</button>
                  <button
                    onClick={() => {
                      if ((isBkashManual || isNagadManual) && !transactionId.trim()) {
                        toast.error("Please enter Transaction ID");
                        return;
                      }
                      setStep(3);
                    }}
                    className="flex-1 btn-primary py-4 text-sm uppercase tracking-widest"
                  >
                    Review Order →
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <div className="bg-white border border-border p-6">
                  <h2 className="font-serif text-xl text-charcoal mb-5">Review Your Order</h2>
                  <div className="space-y-4 text-sm">
                    <ReviewRow label="Name" value={form.name} step={1} setStep={setStep} />
                    <ReviewRow label="Phone" value={form.phone} step={1} setStep={setStep} />
                    <ReviewRow label="Address" value={`${form.address}, ${form.area}, ${form.district}`} step={1} setStep={setStep} />
                    <ReviewRow label="Delivery" value={SHIPPING_OPTIONS.find((s) => s.id === deliveryMethod)?.label} step={1} setStep={setStep} />
                    <ReviewRow label="Payment" value={paymentMethods.find((p) => p.id === paymentMethod)?.label} step={2} setStep={setStep} />
                    {(isBkashManual || isNagadManual) && transactionId && (
                      <ReviewRow label="Transaction ID" value={transactionId} step={2} setStep={setStep} />
                    )}
                  </div>
                </div>

                <div className="bg-white border border-border p-6">
                  <h3 className="font-serif text-lg text-charcoal mb-4">Items ({items.length})</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center gap-3 p-3 border border-border">
                        <img src={item.image} alt={item.name} className="w-14 h-16 object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-charcoal truncate">{item.name}</p>
                          <p className="text-xs text-text-muted">{item.size} × {item.quantity}</p>
                        </div>
                        <p className="text-sm text-charcoal font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-outline py-4 px-6 text-sm">← Back</button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={submitting}
                    className={`flex-1 py-4 text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 ${
                      isBkashAuto ? "bg-[#E2136E] hover:bg-[#c21062] text-white" :
                      isNagadAuto ? "bg-orange-500 hover:bg-orange-600 text-white" :
                      "btn-primary"
                    } transition-colors`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {isAutoPayment ? "Redirecting..." : "Processing..."}
                      </>
                    ) : isBkashAuto ? (
                      <>Pay {formatPrice(total)} with bKash →</>
                    ) : isNagadAuto ? (
                      <>Pay {formatPrice(total)} with Nagad →</>
                    ) : (
                      <>Place Order — {formatPrice(total)}</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-border p-6 lg:sticky lg:top-20">
              <h3 className="font-serif text-lg text-charcoal mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal ({items.length} items)</span>
                  <span className="text-charcoal">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Shipping</span>
                  <span className="text-charcoal">{shippingCharge === 0 ? <span className="text-success">Free</span> : formatPrice(shippingCharge)}</span>
                </div>
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="font-serif text-base text-charcoal">Total</span>
                <span className="font-serif text-2xl text-charcoal">{formatPrice(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function ReviewRow({ label, value, step, setStep }) {
  return (
    <div className="flex items-start justify-between gap-4 pb-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">{label}</p>
        <p className="text-sm text-charcoal">{value || "—"}</p>
      </div>
      <button onClick={() => setStep(step)} className="text-xs text-gold hover:underline shrink-0">Edit</button>
    </div>
  );
}
