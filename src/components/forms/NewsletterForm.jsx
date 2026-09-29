"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/newsletter", {
        email: email.trim(),
        source: "footer",
      });

      toast.success(data.message || "Successfully subscribed!");
      setSubscribed(true);
      setEmail("");

      // Reset success state after 5 seconds
      setTimeout(() => setSubscribed(false), 5000);
    } catch (error) {
      const message =
        error.response?.data?.message || "Subscription failed. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (subscribed) {
    return (
      <div className="flex items-center gap-3 bg-success/10 border border-success/30 px-6 py-3">
        <CheckCircle2 size={20} className="text-success shrink-0" />
        <p className="text-sm text-success font-medium">
          Thank you! You're now part of THOBEIAN Circle.
        </p>
      </div>
    );
  }

  // Form state
  return (
    <form onSubmit={handleSubmit} className="flex">
      <div className="flex-1 flex items-center bg-white/5 border border-white/20 focus-within:border-gold transition-colors">
        <Mail size={16} className="ml-4 text-white/50 shrink-0" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-3 text-sm focus:outline-none placeholder:text-white/40 disabled:opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-gold hover:bg-gold-dark disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 text-sm uppercase tracking-widest font-medium transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span className="hidden sm:inline">Subscribing...</span>
          </>
        ) : (
          "Subscribe"
        )}
      </button>
    </form>
  );
}
