"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import toast from "@/lib/toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await login(form);

      toast.success("Welcome back!");
      router.push("/account");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      setGoogleLoading(true);

      window.location.href = "/api/auth/google";
    } catch (error) {
      console.error("Google login error:", error);

      setGoogleLoading(false);

      toast.error(
        "Unable to start Google sign-in"
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-background-luxury">
      <div className="w-full max-w-md">
        <div className="bg-white border border-border shadow-card p-8 md:p-10">
          <div className="text-center mb-8">
            <p className="heading-sub">
              Welcome Back
            </p>

            <h1 className="font-serif text-3xl text-charcoal mb-2">
              Login to THOBEIAN
            </h1>

            <p className="text-sm text-text-secondary">
              Continue your journey with THOBEIAN
            </p>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="group w-full min-h-[48px] flex items-center justify-center gap-3 rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-charcoal shadow-sm transition-all duration-300 hover:border-gold hover:bg-background-luxury hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-charcoal/20 border-t-gold" />
            ) : (
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.23c0-.78-.07-1.53-.22-2.25H12v4.26h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.4Z"
                />
                <path
                  fill="#34A853"
                  d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.75Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.54 13.83A5.86 5.86 0 0 1 6.23 12c0-.64.11-1.26.31-1.83V7.64H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.36l3.24-2.53Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 6.14c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.24 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.39l3.24 2.53C7.31 7.86 9.46 6.14 12 6.14Z"
                />
              </svg>
            )}

            <span>
              {googleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />

            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
              or
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email Login */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-[38px] text-text-muted transition-colors hover:text-gold"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs text-text-secondary transition-colors hover:text-gold"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-gold transition-colors hover:text-gold-dark"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
