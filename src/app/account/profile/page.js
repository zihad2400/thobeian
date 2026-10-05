"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "@/lib/toast";
import { Loader2, Save, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
  const router = useRouter();
  const { user, initialized } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialized && !user) {
      router.push("/login?redirect=/account/profile");
    }
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [initialized, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.patch("/api/users/profile", form);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!initialized || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background-luxury">
        <Loader2 size={40} className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-luxury">
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="text-xs text-text-muted mb-3 flex items-center gap-2">
            <Link href="/account" className="hover:text-gold">My Account</Link>
            <span>/</span>
            <span className="text-charcoal">Profile</span>
          </nav>
          <p className="heading-sub">Account Settings</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            Edit Profile
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white border border-border p-6 md:p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 mb-6">
            <User size={28} className="text-gold" />
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-luxury"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-2 block">
                Email (cannot change)
              </label>
              <input
                type="email"
                value={form.email}
                className="input-luxury bg-background-luxury cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-2 block">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="01XXXXXXXXX"
                className="input-luxury"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-8 btn-primary text-xs py-3 px-6 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
