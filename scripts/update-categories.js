const fs = require("fs");
const path = require("path");

const newCategories = `export const CATEGORIES = [
  {
    name: "Thobe",
    slug: "thobe",
    image: "/images/categories/thobe.jpg",
    productCount: 24,
  },
  {
    name: "Panjabi",
    slug: "panjabi",
    image: "/images/categories/panjabi.jpg",
    productCount: 32,
  },
  {
    name: "Fabrics",
    slug: "fabrics",
    image: "/images/categories/fabrics.jpg",
    productCount: 12,
  },
  {
    name: "Custom Thobe",
    slug: "custom-thobe",
    image: "/images/categories/custom-thobe.jpg",
    productCount: 0,
  },
  {
    name: "Premium Thobe",
    slug: "premium-signature-thobe",
    image: "/images/products/thobe/premium-signature-thobe.jpg",
    productCount: 8,
  },
  {
    name: "Classic Saudi",
    slug: "classic-saudi-thobe",
    image: "/images/products/thobe/classic-saudi-thobe.jpg",
    productCount: 6,
  },
  {
    name: "Emirati Style",
    slug: "emirati-style-thobe",
    image: "/images/products/thobe/emirati-style-thobe.jpg",
    productCount: 5,
  },
  {
    name: "Royal Black",
    slug: "royal-black-thobe",
    image: "/images/products/thobe/royal-black-thobe.jpg",
    productCount: 4,
  },
];`;

const filePath = path.join(process.cwd(), "src/config/homeData.js");
let content = fs.readFileSync(filePath, "utf8");

// Replace CATEGORIES export
const regex = /export const CATEGORIES = \[[\s\S]*?\];/;
content = content.replace(regex, newCategories);

fs.writeFileSync(filePath, content);
console.log("✅ Categories updated (8 categories)");
