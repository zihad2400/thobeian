import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import CustomThobeDesign from "@/models/CustomThobeDesign";
import Product from "@/models/Product";
import { calculatePrice } from "@/config/customThobe";

import { getCurrentUser } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
} from "@/lib/apiResponse";

import {
  generateOrderNumber,
  SHIPPING_CHARGES,
  COD_FEE,
  FREE_SHIPPING_ABOVE,
} from "@/lib/orderNumber";

import {
  reserveOrderStock,
  releaseOrderStock,
} from "@/lib/orderStock";

function isBkashAutoEnabled() {
  return Boolean(
    process.env.BKASH_APP_KEY &&
    process.env.BKASH_APP_KEY !==
      "YOUR_APP_KEY_HERE"
  );
}

function isNagadAutoEnabled() {
  return Boolean(
    process.env.NAGAD_MERCHANT_ID &&
    process.env.NAGAD_MERCHANT_ID !==
      "YOUR_MERCHANT_ID_HERE" &&
    process.env.NAGAD_MERCHANT_PRIVATE_KEY &&
    process.env.NAGAD_MERCHANT_PRIVATE_KEY !==
      "YOUR_PRIVATE_KEY_HERE"
  );
}

export async function GET() {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user) {
      return errorResponse(
        "Unauthorized",
        401
      );
    }

    const orders = await Order.find({
      user: user._id,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    const customDesigns =
      await CustomThobeDesign.find({
        user: user._id,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return successResponse({
      orders,
      customDesigns,
    });
  } catch (error) {
    console.error(
      "Orders GET error:",
      error
    );

    return errorResponse(
      error.message,
      500
    );
  }
}

export async function POST(req) {
  let reservedItems = [];

  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user) {
      return errorResponse(
        "Please login to place order",
        401
      );
    }

    const body = await req.json();

    const {
      customerInfo,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      transactionId,
      senderNumber,
      notes,
    } = body;

    if (
      !customerInfo?.name?.trim() ||
      !customerInfo?.phone?.trim()
    ) {
      return errorResponse(
        "Name and phone are required",
        400
      );
    }

    if (!shippingAddress?.address?.trim()) {
      return errorResponse(
        "Shipping address is required",
        400
      );
    }

    const paymentMethods = [
      "cod",
      "bkash",
      "nagad",
      "rocket",
      "sslcommerz",
      "card",
    ];

    if (
      !paymentMethods.includes(
        paymentMethod
      )
    ) {
      return errorResponse(
        "Invalid payment method",
        400
      );
    }

    const deliveryMethods = [
      "inside_dhaka",
      "outside_dhaka",
      "express",
    ];

    if (
      !deliveryMethods.includes(
        deliveryMethod
      )
    ) {
      return errorResponse(
        "Invalid delivery method",
        400
      );
    }

    const bkashAuto =
      isBkashAutoEnabled();

    const nagadAuto =
      isNagadAutoEnabled();

    const hasTransaction =
      Boolean(transactionId?.trim());

    if (
      paymentMethod === "bkash" &&
      !bkashAuto &&
      !hasTransaction
    ) {
      return errorResponse(
        "bKash transaction ID is required",
        400
      );
    }

    if (
      paymentMethod === "nagad" &&
      !nagadAuto &&
      !hasTransaction
    ) {
      return errorResponse(
        "Nagad transaction ID is required",
        400
      );
    }

    if (
      paymentMethod === "rocket" &&
      !hasTransaction
    ) {
      return errorResponse(
        "Rocket transaction ID is required",
        400
      );
    }

    const cart = await Cart.findOne({
      user: user._id,
    });

    if (
      !cart ||
      !cart.items?.length
    ) {
      return errorResponse(
        "Your cart is empty",
        400
      );
    }

    /*
     * IMPORTANT:
     * Never trust client price/name/image.
     * Everything below comes from MongoDB.
     */

    const trustedItems = [];

    for (const cartItem of cart.items) {
      const quantity = Number(cartItem.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return errorResponse(
          "Invalid cart quantity",
          400
        );
      }

      /*
       * ============================================================
       * CUSTOM THOBE
       * Made-to-order item.
       * Never uses normal Product inventory.
       * ============================================================
       */
      if (cartItem.isCustom === true) {
        if (!cartItem.customDesignId) {
          return errorResponse(
            "Custom design is missing",
            400
          );
        }

        if (quantity !== 1) {
          return errorResponse(
            "Custom thobes can only be ordered one at a time",
            400
          );
        }

        const customDesign =
          await CustomThobeDesign.findOne({
            designId: cartItem.customDesignId,
            user: user._id,
          }).lean();

        if (!customDesign) {
          return errorResponse(
            "Custom thobe design not found or access denied",
            404
          );
        }

        const customPrice =
          calculatePrice(
            customDesign.config
          );

        trustedItems.push({
          product: undefined,

          variantId: "",

          name:
            customDesign.name?.trim() ||
            "Custom Thobe",

          image:
            customDesign.previewImage ||
            cartItem.image ||
            "",

          sku:
            `CUSTOM-${customDesign.designId}`,

          size:
            cartItem.size ||
            customDesign.config?.size ||
            customDesign.config?.measurements?.size ||
            "",

          color:
            cartItem.color ||
            customDesign.config?.fabricColor ||
            "",

          fabric:
            cartItem.fabric ||
            customDesign.config?.fabric ||
            "",

          price: customPrice,

          quantity: 1,

          isCustom: true,

          customDesignId:
            customDesign.designId,

          customConfig:
            customDesign.config,
        });

        continue;
      }

      /*
       * ============================================================
       * NORMAL PRODUCT
       * Existing production inventory logic.
       * ============================================================
       */

      if (!cartItem.product) {
        return errorResponse(
          `${
            cartItem.name ||
            "A product"
          } is no longer available`,
          400
        );
      }

      const product =
        await Product.findOne({
          _id: cartItem.product,
          status: "published",
        }).lean();

      if (!product) {
        return errorResponse(
          `${
            cartItem.name ||
            "A product"
          } is no longer available`,
          400
        );
      }

      let variant = null;

      if (cartItem.variantId) {
        variant =
          product.variants?.find(
            (item) =>
              item._id?.toString() ===
              cartItem.variantId.toString()
          ) || null;

        if (!variant) {
          return errorResponse(
            `${product.name} variant is no longer available`,
            400
          );
        }
      } else if (
        Array.isArray(product.variants) &&
        product.variants.length > 0
      ) {
        variant =
          product.variants.find(
            (item) =>
              (!cartItem.size ||
                item.size === cartItem.size) &&
              (!cartItem.color ||
                item.color === cartItem.color) &&
              (!cartItem.fabric ||
                item.fabric === cartItem.fabric)
          ) || null;

        if (!variant) {
          return errorResponse(
            `${product.name} selected variant is no longer available`,
            400
          );
        }
      }

      const price =
        typeof variant?.price === "number"
          ? variant.price
          : product.price;

      const stock =
        typeof variant?.stock === "number"
          ? variant.stock
          : Number(product.totalStock || 0);

      if (stock < quantity) {
        return errorResponse(
          `${product.name} does not have enough stock`,
          400
        );
      }

      trustedItems.push({
        product: product._id,

        variantId:
          variant?._id?.toString() ||
          "",

        name: product.name,

        image:
          variant?.image ||
          product.images?.[0] ||
          product.hoverImage ||
          "",

        sku:
          variant?.sku ||
          product.sku ||
          "",

        size:
          variant?.size ||
          cartItem.size ||
          "",

        color:
          variant?.color ||
          cartItem.color ||
          "",

        fabric:
          variant?.fabric ||
          cartItem.fabric ||
          "",

        price,

        quantity,

        isCustom: false,

        customDesignId: "",

        customConfig: undefined,
      });
    }

    const subtotal =
      trustedItems.reduce(
        (sum, item) =>
          sum +
          item.price *
            item.quantity,
        0
      );

    const shippingCharge =
      subtotal >=
      FREE_SHIPPING_ABOVE
        ? 0
        : SHIPPING_CHARGES[
            deliveryMethod
          ] || 80;

    const codFee =
      paymentMethod === "cod"
        ? COD_FEE
        : 0;

    const total =
      subtotal +
      shippingCharge +
      codFee;

    /*
     * Reserve stock atomically.
     */
    /*
     * Only normal products use the inventory system.
     * Custom Thobes are made-to-order and must never consume
     * normal Product/Variant stock.
     */
    const normalStockItems =
      trustedItems.filter(
        (item) => item.isCustom !== true
      );

    reservedItems =
      normalStockItems.length > 0
        ? await reserveOrderStock(
            normalStockItems
          )
        : [];

    const order =
      await Order.create({
        orderNumber:
          generateOrderNumber(),

        user: user._id,

        items: trustedItems,

        customerInfo: {
          name:
            customerInfo.name.trim(),

          phone:
            customerInfo.phone.trim(),

          email:
            customerInfo.email?.trim() ||
            "",
        },

        shippingAddress: {
          division:
            shippingAddress.division ||
            "",

          district:
            shippingAddress.district ||
            "",

          upazila:
            shippingAddress.upazila ||
            "",

          area:
            shippingAddress.area ||
            "",

          address:
            shippingAddress.address.trim(),

          postalCode:
            shippingAddress.postalCode ||
            "",
        },

        deliveryMethod,

        subtotal,

        discount: 0,

        shippingCharge,

        couponDiscount: 0,

        codFee,

        total,

        paymentMethod,

        paymentStatus: "pending",

        orderStatus: "pending",

        trackingNumber: "",

        notes:
          notes?.trim() || "",

        stockReserved: true,

        stockReleased: false,

        ...(hasTransaction
          ? {
              paymentTransactionId:
                transactionId.trim(),

              senderNumber:
                senderNumber?.trim() ||
                "",
            }
          : {}),

        statusHistory: [
          {
            status: "pending",

            timestamp:
              new Date(),

            note:
              "Order placed successfully and stock reserved",
          },
        ],
      });

    const autoPayment =
      (paymentMethod ===
        "bkash" &&
        bkashAuto &&
        !hasTransaction) ||
      (paymentMethod ===
        "nagad" &&
        nagadAuto &&
        !hasTransaction);

    if (autoPayment) {
      order.statusHistory.push({
        status:
          "payment_initiated",

        timestamp:
          new Date(),

        note:
          `${paymentMethod} automatic payment initiated`,
      });

      await order.save();
    } else {
      await Cart.findOneAndUpdate(
        {
          user: user._id,
        },

        {
          $set: {
            items: [],

            updatedAt:
              new Date(),
          },
        }
      );
    }

    return successResponse(
      {
        orderId: order._id,

        orderNumber:
          order.orderNumber,

        total: order.total,

        paymentMethod:
          order.paymentMethod,

        orderStatus:
          order.orderStatus,
      },

      "Order placed successfully",

      201
    );
  } catch (error) {
    if (reservedItems.length) {
      await releaseOrderStock(
        reservedItems
      );
    }

    console.error(
      "Order POST error:",
      error
    );

    return errorResponse(
      error.message ||
        "Failed to create order",
      500
    );
  }
}
