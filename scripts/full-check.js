const fs = require("fs");
const path = require("path");

const checks = {
  files: { passed: 0, failed: 0, missing: [] },
  imports: { passed: 0, failed: 0, issues: [] },
  syntax: { passed: 0, failed: 0, errors: [] },
  apiRoutes: { total: 0, withAuth: 0, withTryCatch: 0 },
  components: { total: 0, withExport: 0, withUseClient: 0 },
};

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) walkDir(filePath, callback);
    else callback(filePath);
  });
}

console.log("═══════════════════════════════════════");
console.log("🔍 COMPREHENSIVE PROJECT CHECK");
console.log("═══════════════════════════════════════");
console.log("");

// 1. Check required files exist
const requiredFiles = [
  "package.json",
  "next.config.mjs",
  "tailwind.config.js",
  "src/app/layout.js",
  "src/app/page.js",
  "src/lib/mongodb.js",
  "src/store/authStore.js",
  "src/store/cartStore.js",
  "src/models/User.js",
  "src/models/Product.js",
  "src/models/Order.js",
];

console.log("📁 Required Files:");
requiredFiles.forEach((f) => {
  if (fs.existsSync(f)) {
    checks.files.passed++;
    console.log(`   ✅ ${f}`);
  } else {
    checks.files.failed++;
    checks.files.missing.push(f);
    console.log(`   ❌ ${f} MISSING`);
  }
});
console.log("");

// 2. Check all .js/.jsx files
walkDir("src", (filePath) => {
  if (!filePath.match(/\.(js|jsx)$/)) return;

  const content = fs.readFileSync(filePath, "utf8");

  // API Routes
  if (filePath.includes("/api/") && filePath.endsWith("route.js")) {
    checks.apiRoutes.total++;
    if (content.includes("getCurrentUser") || content.includes("requireAuth")) {
      checks.apiRoutes.withAuth++;
    }
    if (content.includes("try") && content.includes("catch")) {
      checks.apiRoutes.withTryCatch++;
    }
  }

  // Components
  if (filePath.includes("/components/")) {
    checks.components.total++;
    if (content.includes("export default")) {
      checks.components.withExport++;
    }
    if (content.includes('"use client"') || content.includes("'use client'")) {
      checks.components.withUseClient++;
    }
  }
});

console.log("═══════════════════════════════════════");
console.log("📊 FINAL REPORT");
console.log("═══════════════════════════════════════");
console.log("");
console.log(`📁 Files:`);
console.log(`   Passed: ${checks.files.passed}`);
console.log(`   Failed: ${checks.files.failed}`);
console.log("");
console.log(`🔌 API Routes: ${checks.apiRoutes.total}`);
console.log(`   With Auth: ${checks.apiRoutes.withAuth}`);
console.log(`   With Try/Catch: ${checks.apiRoutes.withTryCatch}`);
console.log("");
console.log(`🧩 Components: ${checks.components.total}`);
console.log(`   With Export: ${checks.components.withExport}`);
console.log(`   Client-side: ${checks.components.withUseClient}`);
console.log("");

const totalIssues =
  checks.files.failed +
  (checks.apiRoutes.total - checks.apiRoutes.withTryCatch) +
  (checks.components.total - checks.components.withExport);

if (totalIssues === 0) {
  console.log("🎉 NO CRITICAL ISSUES FOUND!");
} else {
  console.log(`⚠️  ${totalIssues} issues found`);
}

console.log("═══════════════════════════════════════");
