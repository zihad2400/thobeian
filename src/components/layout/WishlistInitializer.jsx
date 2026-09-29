"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";

export default function WishlistInitializer() {
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    if (initialized && user) {
      fetchWishlist();
    }
  }, [user, initialized, fetchWishlist]);

  return null;
}
