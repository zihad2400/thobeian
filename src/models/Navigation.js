import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, default: "#" },
  type: {
    type: String,
    enum: ["link", "category", "collection", "mega", "custom"],
    default: "link",
  },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Collection" },
  submenu: [
    {
      label: String,
      url: String,
      image: String,
      sortOrder: { type: Number, default: 0 },
    },
  ],
  megaMenu: {
    columns: [
      {
        title: String,
        items: [{ label: String, url: String }],
      },
    ],
    featuredImage: String,
    featuredTitle: String,
    featuredUrl: String,
    featuredCta: String,
  },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  openInNewTab: { type: Boolean, default: false },
});

const NavigationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    location: {
      type: String,
      enum: ["header", "footer", "mobile"],
      default: "header",
    },
    items: [MenuItemSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default
  mongoose.models.Navigation ||
  mongoose.model("Navigation", NavigationSchema);