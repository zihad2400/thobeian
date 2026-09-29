import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,
  initialized: false,

  fetchCart: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get("/api/cart");
      set({ items: data.data.items || [], initialized: true });
    } catch (error) {
      set({ items: [], initialized: true });
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (product, { size, color, quantity = 1 }) => {
    try {
      set({ loading: true });
      const { data } = await axios.post("/api/cart", {
        productId: product._id,
        size,
        color,
        quantity,
        price: product.price,
        name: product.name,
        image: product.images?.[0] || product.image,
      });
      set({ items: data.data.items });
      toast.success("Added to cart");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const { data } = await axios.patch(`/api/cart/${itemId}`, { quantity });
      set({ items: data.data.items });
    } catch (error) {
      toast.error("Failed to update");
    }
  },

  removeItem: async (itemId) => {
    try {
      const { data } = await axios.delete(`/api/cart/${itemId}`);
      set({ items: data.data.items });
      toast.success("Removed from cart");
    } catch (error) {
      toast.error("Failed to remove");
    }
  },

  clearCart: async () => {
    try {
      await axios.delete("/api/cart");
      set({ items: [] });
    } catch (error) {
      console.error(error);
    }
  },

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  },
}));
