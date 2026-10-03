"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verifying, setVerifying] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrorMessage("No reset token provided");
      setVerifying(false);
      return;
    }
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const { data } = await axios.get(
        `/api/auth/reset-password?token=${token}`
      );
      setValidToken(true);
      setEmail(data.data.email);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Invalid or expired reset link"
      );
      setValidToken(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });
      toast.success(data.message || "Password reset successfully!");
      setSuccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== Verifying =====
  if (verifying) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-background-luxury">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-gold mx-auto mb-4" />
          <p className="text-sm text-text-secondary">Verifying link...</p>
        </div>
      </div>
    );
  }

  // ===== Invalid Token =====
  if (!validToken) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-background-luxury">
        <div className="w-full max-w-md">
          <div className="bg-white border border-border shadow-card p-8 md:p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-error/10 rounded-full mb-6">
              <XCircle size={40} className="text-error" />
            </div>
            <h1 className="font-serif text-2xl text-charcoal mb-3">
              Invalid Reset Link
            </h1>
            <p className="text-sm text-text-secondary mb-8">
              {errorMessage}
            </p>
            <div className="space-y-2">
              <Link
                href="/forgot-password"
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                Request New Link
              </Link>
              <Link
                href="/login"
                className="btn-outline w-full py-3 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== Success =====
  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-background-luxury">
        <div className="w-full max-w-md">
          <div className="bg-white border border-border shadow-card p-8 md:p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
              <CheckCircle size={40} className="text-success" />
            </div>
            <h1 className="font-serif text-2xl text-charcoal mb-3">
              Password Reset!
            </h1>
            <p className="text-sm text-text-secondary mb-8">
              Your password has been changed successfully. You can now login
              with your new password.
            </p>
            <Link
              href="/login"
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===== Reset Form =====
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-background-luxury">
      <div className="w-full max-w-md">
        <div className="bg-white border border-border shadow-card p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-5">
              <Lock size={28} className="text-gold" />
            </div>
            <h1 className="font-serif text-3xl text-charcoal mb-2">
              Create New Password
            </h1>
            <p className="text-sm text-text-secondary">
              Resetting password for{" "}
              <strong className="text-charcoal">{email}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-muted hover:text-gold"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type password"
              required
            />

            {/* Password strength */}
            {password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 transition-colors ${
                        password.length >= level * 2
                          ? level <= 2
                            ? "bg-error"
                            : level <= 3
                            ? "bg-warning"
                            : "bg-success"
                          : "bg-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-text-muted">
                  {password.length < 6
                    ? "Too short"
                    : password.length < 8
                    ? "Weak"
                    : password.length < 10
                    ? "Good"
                    : "Strong"}
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            <Link
              href="/login"
              className="text-gold hover:text-gold-dark font-medium"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh]" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
