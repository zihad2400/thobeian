"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  MapPin,
  Plus,
  Trash2,
  Edit,
  Loader2,
  Home,
  X,
  Check,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function AddressesPage() {
  const router = useRouter();
  const { user, initialized } = useAuthStore();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    division: "",
    district: "",
    upazila: "",
    area: "",
    address: "",
    postalCode: "",
    isDefault: false,
  });

  useEffect(() => {
    if (initialized && !user) {
      router.push("/login?redirect=/account/addresses");
    }
  }, [initialized, user, router]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        fullName: user.name || "",
        phone: user.phone || "",
      }));
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/addresses");
      setAddresses(data.data.addresses || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.phone || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await axios.patch(`/api/addresses/${editingId}`, form);
        toast.success("Address updated");
      } else {
        await axios.post("/api/addresses", form);
        toast.success("Address added");
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    try {
      await axios.delete(`/api/addresses/${id}`);
      toast.success("Address deleted");
      fetchAddresses();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (addr) => {
    setForm({
      label: addr.label || "Home",
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      division: addr.division || "",
      district: addr.district || "",
      upazila: addr.upazila || "",
      area: addr.area || "",
      address: addr.address || "",
      postalCode: addr.postalCode || "",
      isDefault: addr.isDefault || false,
    });
    setEditingId(addr._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      label: "Home",
      fullName: user?.name || "",
      phone: user?.phone || "",
      division: "",
      district: "",
      upazila: "",
      area: "",
      address: "",
      postalCode: "",
      isDefault: false,
    });
  };

  if (!initialized || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background-luxury">
        <Loader2 size={40} className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-luxury">
      <div className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="text-xs text-text-muted mb-3 flex items-center gap-2">
            <Link href="/account" className="hover:text-gold">My Account</Link>
            <span>/</span>
            <span className="text-charcoal">Addresses</span>
          </nav>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="heading-sub">Delivery</p>
              <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
                My Addresses
              </h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingId(null);
                setShowForm(!showForm);
              }}
              className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5"
            >
              {showForm ? <X size={14} /> : <Plus size={14} />}
              {showForm ? "Cancel" : "Add Address"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-border p-6 mb-6 animate-slide-down"
          >
            <h3 className="font-serif text-lg text-charcoal mb-5">
              {editingId ? "Edit Address" : "New Address"}
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Label">
                <select
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  className="input-luxury"
                >
                  <option>Home</option>
                  <option>Office</option>
                  <option>Other</option>
                </select>
              </Field>

              <Field label="Full Name *">
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="input-luxury"
                  required
                />
              </Field>

              <Field label="Phone *">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  className="input-luxury"
                  required
                />
              </Field>

              <Field label="Postal Code">
                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  className="input-luxury"
                />
              </Field>

              <Field label="Division">
                <input
                  type="text"
                  name="division"
                  value={form.division}
                  onChange={handleChange}
                  placeholder="Dhaka"
                  className="input-luxury"
                />
              </Field>

              <Field label="District">
                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className="input-luxury"
                />
              </Field>

              <Field label="Upazila / Thana">
                <input
                  type="text"
                  name="upazila"
                  value={form.upazila}
                  onChange={handleChange}
                  className="input-luxury"
                />
              </Field>

              <Field label="Area">
                <input
                  type="text"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  className="input-luxury"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Full Address *">
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    className="input-luxury"
                    required
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-charcoal">
                    Set as default address
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-5 border-t border-border">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                {editingId ? "Update" : "Save Address"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="btn-outline text-xs py-2.5 px-5"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Addresses */}
        {addresses.length === 0 && !showForm ? (
          <div className="bg-white border border-border p-12 text-center">
            <MapPin size={48} className="text-border mx-auto mb-4" />
            <h3 className="font-serif text-xl text-charcoal mb-2">
              No Addresses Yet
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              Add your first delivery address to get started.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={14} /> Add Address
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className="bg-white border border-border p-5 hover:border-gold/40 transition-colors relative"
              >
                {addr.isDefault && (
                  <span className="absolute top-4 right-4 text-[9px] uppercase tracking-widest bg-gold text-white px-2 py-0.5">
                    Default
                  </span>
                )}

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold/10 flex items-center justify-center shrink-0">
                    <Home size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gold mb-1">
                      {addr.label || "Home"}
                    </p>
                    <p className="font-medium text-charcoal text-sm">
                      {addr.fullName}
                    </p>
                    <p className="text-xs text-text-muted">{addr.phone}</p>
                  </div>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {addr.address}
                  {addr.area && `, ${addr.area}`}
                  {addr.upazila && `, ${addr.upazila}`}
                  {addr.district && `, ${addr.district}`}
                  {addr.division && `, ${addr.division}`}
                  {addr.postalCode && ` - ${addr.postalCode}`}
                </p>

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="text-xs text-charcoal hover:text-gold flex items-center gap-1"
                  >
                    <Edit size={12} /> Edit
                  </button>
                  <span className="text-border">|</span>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="text-xs text-error hover:text-error/80 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}
