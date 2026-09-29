import mongoose from "mongoose";

const CustomThobeOrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },

    baseProduct: String,
    fabric: String,
    color: String,
    collar: String,
    placket: String,
    buttons: String,
    pocket: String,
    sleeve: String,
    size: String,

    measurements: {
      height: Number,
      chest: Number,
      waist: Number,
      shoulder: Number,
      sleeve: Number,
      neck: Number,
      length: Number,
    },

    customNotes: String,
    previewImage: String,

    basePrice: Number,
    optionPrice: Number,
    totalPrice: Number,
  },
  { timestamps: true }
);

export default
  mongoose.models.CustomThobeOrder ||
  mongoose.model("CustomThobeOrder", CustomThobeOrderSchema);