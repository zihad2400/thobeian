import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  variantId: {
    type: String,
    default: "",
  },

  name: String,
  image: String,
  sku: String,
  size: String,
  color: String,
  fabric: String,

  price: Number,
  quantity: Number,

  isCustom: {
    type: Boolean,
    default: false,
  },

  customDesignId: String,

  customConfig: mongoose.Schema.Types.Mixed,
});

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [OrderItemSchema],

    customerInfo: {
      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      email: String,
    },

    shippingAddress: {
      division: String,
      district: String,
      upazila: String,
      area: String,

      address: {
        type: String,
        required: true,
      },

      postalCode: String,
    },

    deliveryMethod: {
      type: String,

      enum: [
        "inside_dhaka",
        "outside_dhaka",
        "express",
      ],

      default: "inside_dhaka",
    },

    subtotal: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    shippingCharge: {
      type: Number,
      default: 0,
    },

    couponDiscount: {
      type: Number,
      default: 0,
    },

    codFee: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    couponCode: String,

    paymentMethod: {
      type: String,

      enum: [
        "cod",
        "bkash",
        "nagad",
        "rocket",
        "sslcommerz",
        "card",
      ],

      default: "cod",
    },

    paymentStatus: {
      type: String,

      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],

      default: "pending",
    },

    paymentTransactionId: {
      type: String,
      trim: true,
    },

    senderNumber: {
      type: String,
      trim: true,
    },

    paymentVerifiedAt: Date,

    paymentVerifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    adminPaymentNote: String,

    stockReserved: {
      type: Boolean,
      default: false,
    },

    stockReleased: {
      type: Boolean,
      default: false,
    },

    orderStatus: {
      type: String,

      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
      ],

      default: "pending",
    },

    trackingNumber: String,

    notes: String,

    statusHistory: [
      {
        status: String,

        timestamp: {
          type: Date,
          default: Date.now,
        },

        note: String,
      },
    ],
  },

  {
    timestamps: true,
  }
);

OrderSchema.index({
  user: 1,
  createdAt: -1,
});

OrderSchema.index({
  orderStatus: 1,
});

OrderSchema.index({
  paymentStatus: 1,
});

export default
  mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
