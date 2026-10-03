const fs = require("fs");
const path = require("path");

// Mapping for code files
const REPLACEMENTS = [
  // Thobe images
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1594736797933-d0501ba2fe65[^"']*/g,
    to: "/images/products/thobe/premium-signature-thobe.jpg",
  },
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1610030469983-98e550d6193c[^"']*/g,
    to: "/images/products/thobe/classic-saudi-thobe.jpg",
  },
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1622470953794-aa9c70b0fb9d[^"']*/g,
    to: "/images/products/panjabi/premium-embroidered-panjabi.jpg",
  },
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1528459801416-a9e53bbf4e17[^"']*/g,
    to: "/images/products/panjabi/band-collar-panjabi.jpg",
  },
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1558769132-cb1aea458c5e[^"']*/g,
    to: "/images/products/thobe/linen-summer-thobe.jpg",
  },
  // Catch-all
  {
    from: /https:\/\/images\.unsplash\.com\/[^"']*/g,
    to: "/images/categories/thobe.jpg",
  },
];

// Files to update
const FILES = [
  "src/app/about/page.js",
  "src/app/collections/page.js",
  "src/app/collections/[slug]/page.js",
  "src/config/homeData.js",
  "src/config/navbarData.js",
];

let totalReplacements = 0;

FILES.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipped (not found): ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");
  let replacements = 0;

  REPLACEMENTS.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      content = content.replace(from, to);
      replacements += matches.length;
    }
  });

  if (replacements > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${file} — ${replacements} URLs replaced`);
    totalReplacements += replacements;
  } else {
    console.log(`  ${file} — no changes`);
  }
});

console.log("");
console.log("═══════════════════════════════════════");
console.log(`✅ Total URLs replaced: ${totalReplacements}`);
console.log("═══════════════════════════════════════");
