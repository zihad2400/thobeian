"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "@/lib/toast";
import { ArrowLeft, Mail, CheckCircle, Loader2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/forgot-password", {
        email: email.trim(),
      });
      toast.success(data.message || "Reset link sent!");
      setSent(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===== Success State =====
  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-background-luxury">
        <div className="w-full max-w-md">
          <div className="bg-white border border-border shadow-card p-8 md:p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
              <CheckCircle size={40} className="text-success" />
            </div>

            <h1 className="font-serif text-2xl text-charcoal mb-3">
              Check Your Email
            </h1>

            <p className="text-sm text-text-secondary leading-relaxed mb-2">
              If an account exists with <strong>{email}</strong>, you'll
              receive a password reset link shortly.
            </p>

            <p className="text-xs text-text-muted mb-6">
              Don't forget to check your spam folder.
            </p>

            <div className="bg-background-luxury border border-border p-4 mb-6 text-left">
              <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2">
                What's Next?
              </p>
              <ol className="text-xs text-text-secondary space-y-1.5 list-decimal list-inside">
                <li>Check your email inbox</li>
                <li>Click the "Reset Password" button</li>
                <li>Create a new password</li>
                <li>Login with your new password</li>
              </ol>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setSent(false)}
                className="w-full text-sm text-gold hover:underline"
              >
                Didn't receive email? Try again
              </button>
              <Link
                href="/login"
                className="w-full btn-outline py-3 flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== Form State =====
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-background-luxury">
      <div className="w-full max-w-md">
        <div className="bg-white border border-border shadow-card p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-5">
              <Mail size={28} className="text-gold" />
            </div>
            <h1 className="font-serif text-3xl text-charcoal mb-2">
              Forgot Password?
            </h1>
            <p className="text-sm text-text-secondary">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>Send Reset Link</>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-gold hover:text-gold-dark font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
