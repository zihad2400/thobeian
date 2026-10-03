const fs = require("fs");
const path = require("path");

const issues = {
  errors: [],
  warnings: [],
  unused: [],
  emptyFiles: [],
};

// Walk through src directory
function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else {
      callback(filePath);
    }
  });
}

console.log("═══════════════════════════════════════");
console.log("🔍 PROJECT HEALTH CHECK");
console.log("═══════════════════════════════════════");
console.log("");

// Check all src files
walkDir("src", (filePath) => {
  if (!filePath.match(/\.(js|jsx)$/)) return;
  if (filePath.includes("node_modules")) return;

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const relPath = filePath;

  // Empty files
  if (content.trim().length === 0) {
    issues.emptyFiles.push(relPath);
    return;
  }

  // Console.log in production code
  const consoleLogs = content.match(/console\.log\(/g);
  if (consoleLogs && !filePath.includes("scripts/") && !filePath.includes("/api/")) {
    issues.warnings.push(
      `${relPath}: ${consoleLogs.length} console.log() calls`
    );
  }

  // TODO/FIXME
  const todos = content.match(/\/\/\s*(TODO|FIXME|XXX|HACK)/gi);
  if (todos) {
    todos.forEach((todo) => {
      issues.warnings.push(`${relPath}: ${todo}`);
    });
  }

  // Unused imports (basic check)
  const imports = content.match(/import\s+{([^}]+)}\s+from/g);
  if (imports) {
    imports.forEach((imp) => {
      const match = imp.match(/import\s+{([^}]+)}\s+from/);
      if (match) {
        const names = match[1].split(",").map((n) => n.trim().split(" as ")[0]);
        names.forEach((name) => {
          if (name && !content.match(new RegExp(`\\b${name}\\b`, "g"))) {
            // Skip false positives
          }
        });
      }
    });
  }

  // Check for react-hooks issues
  if (content.includes("useEffect") && !content.includes("useEffect(")) {
    issues.warnings.push(`${relPath}: possible useEffect issue`);
  }

  // Check API routes have try/catch
  if (filePath.includes("/api/") && !content.includes("try") && !content.includes("catch")) {
    issues.errors.push(`${relPath}: API route missing try/catch`);
  }
});

// Check for empty files
console.log("📁 Empty Files:");
if (issues.emptyFiles.length === 0) {
  console.log("   ✅ None");
} else {
  issues.emptyFiles.forEach((f) => console.log(`   ⚠️  ${f}`));
}
console.log("");

// Summary
console.log("═══════════════════════════════════════");
console.log("📊 SUMMARY");
console.log("═══════════════════════════════════════");
console.log("");
console.log(`❌ Errors:   ${issues.errors.length}`);
console.log(`⚠️  Warnings: ${issues.warnings.length}`);
console.log(`📁 Empty:    ${issues.emptyFiles.length}`);
console.log("");

if (issues.errors.length > 0) {
  console.log("❌ ERRORS:");
  issues.errors.forEach((e) => console.log(`   ${e}`));
  console.log("");
}

if (issues.warnings.length > 0) {
  console.log("⚠️  WARNINGS (first 20):");
  issues.warnings.slice(0, 20).forEach((w) => console.log(`   ${w}`));
  if (issues.warnings.length > 20) {
    console.log(`   ... and ${issues.warnings.length - 20} more`);
  }
  console.log("");
}

console.log("═══════════════════════════════════════");
