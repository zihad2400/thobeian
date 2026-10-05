import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" },
  fullName: String,
  phone: String,
  division: String,
  district: String,
  upazila: String,
  area: String,
  address: String,
  postalCode: String,
  isDefault: { type: Boolean, default: false },
});

const MeasurementSchema = new mongoose.Schema({
  label: { type: String, required: true },
  height: Number,
  chest: Number,
  waist: Number,
  shoulder: Number,
  sleeve: Number,
  neck: Number,
  length: Number,
  notes: String,
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "admin", "superadmin"],
      default: "customer",
    },

    avatar: {
      type: String,
      default: "",
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    addresses: [AddressSchema],

    measurementProfiles: [MeasurementSchema],

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
