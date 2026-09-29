import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get("/api/auth/me");
      set({ user: data.data.user, initialized: true });
      return data.data.user;
    } catch (error) {
      set({ user: null, initialized: true });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  register: async (payload) => {
    const { data } = await axios.post("/api/auth/register", payload);
    set({ user: data.data.user });
    return data.data.user;
  },

  login: async (payload) => {
    const { data } = await axios.post("/api/auth/login", payload);
    set({ user: data.data.user });
    return data.data.user;
  },

  logout: async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      set({ user: null });

      if (typeof document !== "undefined") {
        document.cookie = "thobeian_token=; Max-Age=0; path=/;";
      }

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  },
}));
