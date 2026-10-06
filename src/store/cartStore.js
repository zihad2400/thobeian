import { create } from "zustand";
import axios from "axios";
import toast from "@/lib/toast";

function findProductVariant(product, { variantId, size, color, fabric }) {
  if (!Array.isArray(product?.variants) || product.variants.length === 0) {
    return null;
  }

  if (variantId) {
    return (
      product.variants.find(
        (variant) => variant._id?.toString() === variantId.toString()
      ) || null
    );
  }

  return (
    product.variants.find(
      (variant) =>
        (!size || variant.size === size) &&
        (!color || variant.color === color) &&
        (!fabric || variant.fabric === fabric)
    ) || null
  );
}

export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,
  initialized: false,

  fetchCart: async () => {
    try {
      set({ loading: true });

      const { data } = await axios.get("/api/cart");

      set({
        items: data.data.items || [],
        initialized: true,
      });
    } catch (error) {
      console.error("Fetch cart error:", error);

      set({
        items: [],
        initialized: true,
      });
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (
    product,
    {
      variantId,
      size,
      color,
      fabric,
      quantity = 1,
      isCustom = false,
      customDesignId = "",
      customConfig = null,
      customName = "Custom Thobe",
      customPreviewImage = "",
    } = {}
  ) => {
    const previousItems = get().items;

    /*
     * ============================================================
     * CUSTOM THOBE
     * ============================================================
     */
    if (isCustom) {
      if (!customDesignId) {
        toast.error("Custom design is missing");
        return false;
      }

      if (quantity !== 1) {
        toast.error("Custom thobe can only be added one at a time");
        return false;
      }

      set({
        loading: true,
        initialized: true,
      });

      try {
        const { data } = await axios.post("/api/cart", {
          isCustom: true,
          customDesignId,
          customConfig,
          customName,
          customPreviewImage,
          quantity: 1,
        });

        set({
          items: data.data.items || [],
          initialized: true,
          loading: false,
        });

        toast.success("Custom thobe added to cart");

        return true;
      } catch (error) {
        console.error(
          "Add custom thobe to cart error:",
          error
        );

        set({
          items: previousItems,
          loading: false,
        });

        toast.error(
          error.response?.data?.message ||
            "Failed to add custom thobe"
        );

        return false;
      }
    }

    /*
     * ============================================================
     * NORMAL PRODUCT
     * Existing production logic remains unchanged.
     * ============================================================
     */

    const defaultSize = size || "M";
    const defaultColor = color || "";
    const defaultFabric = fabric || "";

    const variant = findProductVariant(product, {
      variantId,
      size: defaultSize,
      color: defaultColor,
      fabric: defaultFabric,
    });

    if (product?.variants?.length && !variant) {
      toast.error("Selected variant is unavailable");
      return false;
    }

    const resolvedVariantId = variant?._id?.toString() || "";
    const resolvedPrice =
      typeof variant?.price === "number"
        ? variant.price
        : product.price;

    const resolvedImage =
      variant?.image ||
      product.images?.[0] ||
      product.image ||
      "";

    const resolvedSize = variant?.size || defaultSize;
    const resolvedColor = variant?.color || defaultColor;
    const resolvedFabric = variant?.fabric || defaultFabric;

    const existingIndex = previousItems.findIndex(
      (item) =>
        item.product?.toString() === product._id?.toString() &&
        (item.variantId || "") === resolvedVariantId &&
        item.size === resolvedSize &&
        item.color === resolvedColor &&
        item.fabric === resolvedFabric
    );

    let optimisticItems;

    if (existingIndex >= 0) {
      optimisticItems = previousItems.map((item, index) =>
        index === existingIndex
          ? {
              ...item,
              quantity: item.quantity + quantity,
              price: resolvedPrice,
              name: product.name,
              image: resolvedImage,
              fabric: resolvedFabric,
            }
          : item
      );
    } else {
      optimisticItems = [
        ...previousItems,
        {
          _id: `optimistic-${Date.now()}`,
          product: product._id,
          variantId: resolvedVariantId,
          size: resolvedSize,
          color: resolvedColor,
          fabric: resolvedFabric,
          quantity,
          price: resolvedPrice,
          name: product.name,
          image: resolvedImage,
        },
      ];
    }

    set({
      items: optimisticItems,
      initialized: true,
      loading: true,
    });

    toast.success("Added to cart");

    try {
      const { data } = await axios.post("/api/cart", {
        productId: product._id,
        variantId: resolvedVariantId || undefined,
        size: resolvedSize,
        color: resolvedColor,
        fabric: resolvedFabric,
        quantity,
      });

      set({
        items: data.data.items || [],
        initialized: true,
        loading: false,
      });

      return true;
    } catch (error) {
      console.error("Add to cart error:", error);

      set({
        items: previousItems,
        loading: false,
      });

      toast.error(
        error.response?.data?.message ||
          "Failed to add to cart"
      );

      return false;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const { data } = await axios.patch(
        `/api/cart/${itemId}`,
        { quantity }
      );

      set({
        items: data.data.items || [],
      });
    } catch (error) {
      console.error("Update cart error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update"
      );
    }
  },

  removeItem: async (itemId) => {
    try {
      const { data } = await axios.delete(
        `/api/cart/${itemId}`
      );

      set({
        items: data.data.items || [],
      });

      toast.success("Removed from cart");
    } catch (error) {
      console.error("Remove cart item error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to remove"
      );
    }
  },

  clearCart: async () => {
    try {
      await axios.delete("/api/cart");

      set({
        items: [],
      });
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  },

  getTotalItems: () => {
    return get().items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  },

  getSubtotal: () => {
    return get().items.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );
  },
}));
