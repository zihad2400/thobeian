import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { cookies } from "next/headers";
import crypto from "crypto";
import CustomThobeDesign from "@/models/CustomThobeDesign";
import { calculatePrice, generateDesignId } from "@/config/customThobe";

async function getSessionId() {
  const cookieStore = await cookies();
  return cookieStore.get("thobeian_session")?.value;
}

async function getOrCreateSessionId() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("thobeian_session")?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();

    cookieStore.set("thobeian_session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return sessionId;
}

async function findCart(user) {
  if (user) {
    return Cart.findOne({ user: user._id });
  }

  const sessionId = await getSessionId();

  if (!sessionId) {
    return null;
  }

  return Cart.findOne({ sessionId });
}

export async function GET() {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const cart = await findCart(user);

    return successResponse({
      items: cart?.items || [],
    });
  } catch (error) {
    console.error("Cart GET error:", error);
    return errorResponse(error.message, 500);
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const body = await req.json();

    const {
      productId,
      variantId,
      size,
      color,
      fabric,
      quantity = 1,

      // Custom Thobe
      isCustom = false,
      customDesignId,
      customConfig,
      customName,
      customPreviewImage,
    } = body;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return errorResponse("Invalid quantity", 400);
    }

    /*
     * ============================================================
     * CUSTOM THOBE CART ITEM
     * ============================================================
     */
    if (isCustom) {
      if (quantity !== 1) {
        return errorResponse(
          "Custom thobes can only be added one at a time",
          400
        );
      }

      const sessionId = await getSessionId();

      /*
       * FAST CUSTOM THOBE FLOW
       *
       * If config is supplied, create/update the design and
       * add it to the cart in THIS SAME request.
       *
       * This removes the previous:
       * /api/custom-thobe -> /api/cart
       * sequential production round-trip.
       */

      let design = null;

      if (customConfig) {
        if (
          typeof customConfig !== "object" ||
          Array.isArray(customConfig)
        ) {
          return errorResponse(
            "Invalid custom configuration",
            400
          );
        }

        if (
          customPreviewImage &&
          typeof customPreviewImage !== "string"
        ) {
          return errorResponse(
            "Invalid preview image",
            400
          );
        }

        if (
          customPreviewImage &&
          customPreviewImage.length > 500000
        ) {
          return errorResponse(
            "Preview image is too large",
            400
          );
        }

        const trustedPrice = calculatePrice(customConfig);

        if (customDesignId) {
          design = await CustomThobeDesign.findOne({
            designId: customDesignId,
            ...(user
              ? { user: user._id }
              : { sessionId }),
          });
        }

        if (design) {
          design.config = customConfig;
          design.totalPrice = trustedPrice;

          if (typeof customPreviewImage === "string") {
            design.previewImage = customPreviewImage;
          }

          if (
            typeof customName === "string" &&
            customName.trim()
          ) {
            design.name = customName.trim();
          }

          await design.save();
        } else {
          const newDesignId = customDesignId || generateDesignId();

          design = await CustomThobeDesign.create({
            designId: newDesignId,
            user: user?._id || null,
            sessionId,
            config: customConfig,
            totalPrice: trustedPrice,
            previewImage:
              customPreviewImage || null,
            name:
              typeof customName === "string" &&
              customName.trim()
                ? customName.trim()
                : "Custom Thobe",
          });
        }
      } else if (customDesignId) {
        design = await CustomThobeDesign.findOne({
          designId: customDesignId,
          ...(user
            ? { user: user._id }
            : { sessionId }),
        });
      }

      if (!design) {
        return errorResponse(
          "Custom design not found or access denied",
          404
        );
      }

      /*
       * IMPORTANT:
       * Always use the trusted design ID generated/resolved
       * by the server, never the raw request value.
       */
      const resolvedCustomDesignId = design.designId;

      const trustedPrice = calculatePrice(
        design.config
      );

      const resolvedCustomName =
        design.name?.trim() || "Custom Thobe";

      const customImage =
        design.previewImage || "";

      const customFabric =
        design.config?.fabric || "";

      const customColor =
        design.config?.fabricColor || "";

      const customSize =
        design.config?.size ||
        design.config?.measurements?.size ||
        "";

      let cart = await findCart(user);

      if (!cart) {
        if (user) {
          cart = await Cart.create({
            user: user._id,
            items: [],
          });
        } else {
          const newSessionId = await getOrCreateSessionId();

          cart = await Cart.create({
            sessionId: newSessionId,
            items: [],
          });
        }
      }

      /*
       * A custom design is unique.
       * Adding the exact same design again increases quantity.
       */
      const existingIdx = cart.items.findIndex(
        (item) =>
          item.isCustom === true &&
          item.customDesignId === resolvedCustomDesignId
      );

      if (existingIdx >= 0) {
        cart.items[existingIdx].quantity += 1;
        cart.items[existingIdx].price = trustedPrice;
        cart.items[existingIdx].name = resolvedCustomName;
        cart.items[existingIdx].image = customImage;
        cart.items[existingIdx].fabric = customFabric;
        cart.items[existingIdx].color = customColor;
        cart.items[existingIdx].size = customSize;
        cart.items[existingIdx].customConfig =
          design.config;
      } else {
        cart.items.push({
          product: undefined,
          variantId: "",
          name: resolvedCustomName,
          image: customImage,
          size: customSize,
          color: customColor,
          fabric: customFabric,
          price: trustedPrice,
          quantity: 1,
          isCustom: true,
          customDesignId: resolvedCustomDesignId,
          customConfig: design.config,
        });
      }

      cart.updatedAt = new Date();

      await cart.save();

      return successResponse(
        {
          items: cart.items,
          customDesignId: design.designId,
        },
        "Custom thobe added to cart"
      );
    }

    /*
     * ============================================================
     * NORMAL PRODUCT CART ITEM
     * Existing production logic remains unchanged.
     * ============================================================
     */

    if (!productId) {
      return errorResponse("Product is required", 400);
    }

    const product = await Product.findOne({
      _id: productId,
      status: "published",
    }).lean();

    if (!product) {
      return errorResponse(
        "Product not found or unavailable",
        404
      );
    }

    let variant = null;

    if (variantId) {
      variant = product.variants?.find(
        (item) =>
          item._id?.toString() === variantId.toString()
      );

      if (!variant) {
        return errorResponse(
          "Selected variant not found",
          400
        );
      }
    } else if (product.variants?.length) {
      variant = product.variants.find(
        (item) =>
          (size ? item.size === size : true) &&
          (color ? item.color === color : true) &&
          (fabric ? item.fabric === fabric : true)
      );

      if (!variant) {
        return errorResponse(
          "Selected product variant is unavailable",
          400
        );
      }
    }

    const resolvedSize =
      variant?.size || size || "";

    const resolvedColor =
      variant?.color || color || "";

    const resolvedFabric =
      variant?.fabric || fabric || "";

    const resolvedPrice =
      typeof variant?.price === "number"
        ? variant.price
        : product.price;

    const resolvedImage =
      variant?.image ||
      product.images?.[0] ||
      product.hoverImage ||
      "";

    const availableStock =
      typeof variant?.stock === "number"
        ? variant.stock
        : product.totalStock;

    if (availableStock < 1) {
      return errorResponse(
        "This product is out of stock",
        400
      );
    }

    let cart = await findCart(user);

    if (!cart) {
      if (user) {
        cart = await Cart.create({
          user: user._id,
          items: [],
        });
      } else {
        const sessionId = await getOrCreateSessionId();

        cart = await Cart.create({
          sessionId,
          items: [],
        });
      }
    }

    const existingIdx = cart.items.findIndex(
      (item) =>
        !item.isCustom &&
        item.product?.toString() === productId.toString() &&
        (item.variantId || "") ===
          (variant?._id?.toString() || "") &&
        item.size === resolvedSize &&
        item.color === resolvedColor &&
        item.fabric === resolvedFabric
    );

    const existingQuantity =
      existingIdx >= 0
        ? cart.items[existingIdx].quantity
        : 0;

    if (
      existingQuantity + quantity >
      availableStock
    ) {
      return errorResponse(
        `Only ${availableStock} item${
          availableStock === 1 ? "" : "s"
        } available`,
        400
      );
    }

    if (existingIdx >= 0) {
      cart.items[existingIdx].quantity += quantity;

      cart.items[existingIdx].name =
        product.name;

      cart.items[existingIdx].price =
        resolvedPrice;

      cart.items[existingIdx].image =
        resolvedImage;

      cart.items[existingIdx].variantId =
        variant?._id?.toString() || "";

      cart.items[existingIdx].size =
        resolvedSize;

      cart.items[existingIdx].color =
        resolvedColor;

      cart.items[existingIdx].fabric =
        resolvedFabric;
    } else {
      cart.items.push({
        product: product._id,
        variantId:
          variant?._id?.toString() || "",
        name: product.name,
        image: resolvedImage,
        size: resolvedSize,
        color: resolvedColor,
        fabric: resolvedFabric,
        price: resolvedPrice,
        quantity,
        isCustom: false,
      });
    }

    cart.updatedAt = new Date();

    await cart.save();

    return successResponse(
      {
        items: cart.items,
      },
      "Added to cart"
    );
  } catch (error) {
    console.error("Cart POST error:", error);

    return errorResponse(
      error.message || "Failed to add to cart",
      500
    );
  }
}
export async function DELETE() {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const sessionId = await getSessionId();

    if (user) {
      await Cart.findOneAndUpdate(
        { user: user._id },
        {
          $set: {
            items: [],
            updatedAt: new Date(),
          },
        }
      );
    } else if (sessionId) {
      await Cart.findOneAndUpdate(
        { sessionId },
        {
          $set: {
            items: [],
            updatedAt: new Date(),
          },
        }
      );
    }

    return successResponse(
      {
        items: [],
      },
      "Cart cleared"
    );
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return errorResponse(error.message, 500);
  }
}
