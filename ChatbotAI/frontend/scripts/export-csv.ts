/**
 * Export ALL data to CSV files
 * Run: npx tsx scripts/export-csv.ts
 */
import * as fs from "fs";
import * as path from "path";

// ── Import all mega data ──
import { ALL_MEGA_PRODUCTS, MEGA_PRODUCT_STATS } from "../src/lib/data/mega-products";
import { MEGA_PREBUILT_PCS, MEGA_COMPAT_RULES, MEGA_ASSEMBLY_GUIDES } from "../src/lib/data/mega-builds";
import { MEGA_FAQ } from "../src/lib/data/mega-faq";
import { MEGA_KNOWLEDGE } from "../src/lib/data/mega-knowledge";

// Reviews need special handling because of generateBatchReviews()
import { MEGA_REVIEWS } from "../src/lib/data/mega-reviews";

// ── Helpers ──
const OUT_DIR = path.resolve(__dirname, "..", "data-export");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** Escape a value for CSV: wrap in quotes if it contains comma, newline or quote */
function csvVal(val: unknown): string {
  if (val === null || val === undefined) return "";
  let s: string;
  if (typeof val === "object") {
    s = JSON.stringify(val);
  } else {
    s = String(val);
  }
  // Escape double quotes by doubling them
  s = s.replace(/"/g, '""');
  // Always wrap in double quotes for safety
  return `"${s}"`;
}

function writeCsv(filename: string, headers: string[], rows: string[][]) {
  const headerLine = headers.map((h) => csvVal(h)).join(",");
  const dataLines = rows.map((row) => row.join(","));
  const content = [headerLine, ...dataLines].join("\n");
  const filePath = path.join(OUT_DIR, filename);
  fs.writeFileSync(filePath, "\uFEFF" + content, "utf-8"); // BOM for Excel
  console.log(`  ✅ ${filename} — ${rows.length} rows`);
}

// ════════════════════════════════════════
// 1. PRODUCTS
// ════════════════════════════════════════
function exportProducts() {
  const headers = [
    "id", "name", "category", "brand", "price", "discountPrice",
    "image", "shortDesc", "specs", "stock", "rating", "tags", "compatKey"
  ];
  const rows = ALL_MEGA_PRODUCTS.map((p) => [
    csvVal(p.id),
    csvVal(p.name),
    csvVal(p.category),
    csvVal(p.brand),
    csvVal(p.price),
    csvVal(p.discountPrice ?? ""),
    csvVal(p.image),
    csvVal(p.shortDesc),
    csvVal(p.specs),         // JSON object
    csvVal(p.stock),
    csvVal(p.rating),
    csvVal(p.tags),          // JSON array
    csvVal(p.compatKey ?? ""),
  ]);
  writeCsv("products.csv", headers, rows);
}

// ════════════════════════════════════════
// 2. PREBUILT PCS
// ════════════════════════════════════════
function exportPrebuiltPCs() {
  const headers = [
    "id", "name", "purpose", "price", "image",
    "cpu", "gpu", "mainboard", "ram", "storage", "psu", "case", "cooler",
    "description", "rating"
  ];
  const rows = MEGA_PREBUILT_PCS.map((b) => [
    csvVal(b.id),
    csvVal(b.name),
    csvVal(b.purpose),
    csvVal(b.price),
    csvVal(b.image),
    csvVal(b.components.cpu),
    csvVal(b.components.gpu),
    csvVal(b.components.mainboard),
    csvVal(b.components.ram),
    csvVal(b.components.storage),
    csvVal(b.components.psu),
    csvVal(b.components.case),
    csvVal(b.components.cooler),
    csvVal(b.description),
    csvVal(b.rating),
  ]);
  writeCsv("prebuilt_pcs.csv", headers, rows);
}

// ════════════════════════════════════════
// 3. COMPATIBILITY RULES
// ════════════════════════════════════════
function exportCompatRules() {
  const headers = [
    "id", "component1Category", "component2Category", "matchKey", "description"
  ];
  const rows = MEGA_COMPAT_RULES.map((r) => [
    csvVal(r.id),
    csvVal(r.component1Category),
    csvVal(r.component2Category),
    csvVal(r.matchKey),
    csvVal(r.description),
  ]);
  writeCsv("compatibility_rules.csv", headers, rows);
}

// ════════════════════════════════════════
// 4. ASSEMBLY GUIDES
// ════════════════════════════════════════
function exportAssemblyGuides() {
  const headers = [
    "id", "title", "difficulty", "estimatedTime", "tools", "steps"
  ];
  const rows = MEGA_ASSEMBLY_GUIDES.map((g) => [
    csvVal(g.id),
    csvVal(g.title),
    csvVal(g.difficulty),
    csvVal(g.estimatedTime),
    csvVal(g.tools),       // JSON array
    csvVal(g.steps),       // JSON array of step objects
  ]);
  writeCsv("assembly_guides.csv", headers, rows);
}

// ════════════════════════════════════════
// 5. FAQ
// ════════════════════════════════════════
function exportFAQ() {
  const headers = ["id", "question", "answer", "category", "tags"];
  const rows = MEGA_FAQ.map((f) => [
    csvVal(f.id),
    csvVal(f.question),
    csvVal(f.answer),
    csvVal(f.category),
    csvVal(f.tags),        // JSON array
  ]);
  writeCsv("faq.csv", headers, rows);
}

// ════════════════════════════════════════
// 6. REVIEWS
// ════════════════════════════════════════
function exportReviews() {
  const headers = [
    "id", "productId", "userId", "userName", "rating",
    "title", "content", "pros", "cons", "verified", "createdAt"
  ];
  const rows = MEGA_REVIEWS.map((r) => [
    csvVal(r.id),
    csvVal(r.productId),
    csvVal(r.userId),
    csvVal(r.userName),
    csvVal(r.rating),
    csvVal(r.title),
    csvVal(r.content),
    csvVal(r.pros),        // JSON array
    csvVal(r.cons),        // JSON array
    csvVal(r.verified),
    csvVal(r.createdAt),
  ]);
  writeCsv("reviews.csv", headers, rows);
}

// ════════════════════════════════════════
// 7. KNOWLEDGE
// ════════════════════════════════════════
function exportKnowledge() {
  const headers = ["id", "title", "content", "tags", "source", "createdAt"];
  const rows = MEGA_KNOWLEDGE.map((k) => [
    csvVal(k.id),
    csvVal(k.title),
    csvVal(k.content),
    csvVal(k.tags),        // JSON array
    csvVal(k.source),
    csvVal(k.createdAt),
  ]);
  writeCsv("knowledge.csv", headers, rows);
}

// ════════════════════════════════════════
// RUN ALL
// ════════════════════════════════════════
console.log("\n📦 Exporting all data to CSV...\n");
ensureDir(OUT_DIR);

exportProducts();
exportPrebuiltPCs();
exportCompatRules();
exportAssemblyGuides();
exportFAQ();
exportReviews();
exportKnowledge();

console.log(`\n✨ Done! ${7} CSV files saved to: ${OUT_DIR}`);
console.log(`\n📊 Data Statistics:`);
console.log(`  Products:           ${ALL_MEGA_PRODUCTS.length}`);
console.log(`  Prebuilt PCs:       ${MEGA_PREBUILT_PCS.length}`);
console.log(`  Compat Rules:       ${MEGA_COMPAT_RULES.length}`);
console.log(`  Assembly Guides:    ${MEGA_ASSEMBLY_GUIDES.length}`);
console.log(`  FAQ:                ${MEGA_FAQ.length}`);
console.log(`  Reviews:            ${MEGA_REVIEWS.length}`);
console.log(`  Knowledge:          ${MEGA_KNOWLEDGE.length}`);
console.log(`\n📁 Product breakdown:`, MEGA_PRODUCT_STATS);
