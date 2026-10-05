import { create } from "zustand";
import axios from "axios";
import toast from "@/lib/toast";

export const useWishlistStore = create((set, get) => ({
  items: [],
  loading: false,
  initialized: false,

  fetchWishlist: async () => {
    try {
      set({ loading: true });

      const { data } = await axios.get("/api/wishlist");

      set({
        items: data.data.products || [],
        initialized: true,
      });
    } catch (error) {
      console.error("Wishlist fetch error:", error);

      set({
        items: [],
        initialized: true,
      });
    } finally {
      set({ loading: false });
    }
  },

  toggleWishlist: async (productId) => {
    try {
      set({ loading: true });

      const { data } = await axios.post(
        "/api/wishlist",
        {
          productId,
        }
      );

      set({
        items: data.data.products || [],
        initialized: true,
      });

      toast.success(data.message);

      return true;
    } catch (error) {
      console.error("Wishlist toggle error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update wishlist"
      );

      return false;
    } finally {
      set({ loading: false });
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => {
      const id =
        typeof item === "string"
          ? item
          : item?._id;

      return id === productId;
    });
  },

  clearWishlist: () => {
    set({
      items: [],
      initialized: true,
    });
  },
}));
