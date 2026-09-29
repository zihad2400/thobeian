"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Logo({ className = "" }) {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push("/");
    // Force scroll to top
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      className={`font-serif text-2xl md:text-3xl tracking-wider text-charcoal hover:text-gold transition-colors ${className}`}
    >
      THOBEIAN
    </Link>
  );
}
