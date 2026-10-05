"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";

export default function WishlistInitializer() {
  const fetchWishlist = useWishlistStore(
    (s) => s.fetchWishlist
  );

  const initialized = useAuthStore(
    (s) => s.initialized
  );

  useEffect(() => {
    if (initialized) {
      fetchWishlist();
    }
  }, [initialized, fetchWishlist]);

  return null;
}
