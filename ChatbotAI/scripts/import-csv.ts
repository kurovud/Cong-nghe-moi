/**
 * Import CSV dataset and convert to seed JSON files used by services.
 *
 * Usage:
 *   npx tsx scripts/import-csv.ts
 *   npx tsx scripts/import-csv.ts --input ./frontend/data-export --output ./scripts/seed-data
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { basename, join, resolve } from "path";

type CsvRow = Record<string, string>;

function getArg(name: string, fallback: string): string {
  const args = process.argv.slice(2);
  const index = args.findIndex((arg) => arg === `--${name}`);
  if (index >= 0 && args[index + 1]) {
    return resolve(args[index + 1]);
  }
  return resolve(fallback);
}

function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    const next = content[i + 1];

    if (ch === "\r") {
      continue;
    }

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if (ch === "\n" && !inQuotes) {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += ch;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((r) => r.some((v) => String(v).trim().length > 0));
}

function csvToObjects(content: string): CsvRow[] {
  const rows = parseCsv(content);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((values) => {
    const out: CsvRow = {};
    headers.forEach((header, index) => {
      out[header] = (values[index] ?? "").trim();
    });
    return out;
  });
}

function toNumber(value: string | undefined, fallback = 0): number {
  if (!value || value.trim() === "") return fallback;
  const clean = value.replace(/,/g, "").trim();
  const n = Number(clean);
  return Number.isFinite(n) ? n : fallback;
}

function toBoolean(value: string | undefined): boolean {
  return String(value || "").toLowerCase() === "true";
}

function parseJson<T>(value: string | undefined, fallback: T): T {
  if (!value || value.trim() === "") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function writeJson(outDir: string, filename: string, data: unknown) {
  const fullPath = join(outDir, filename);
  writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf8");
  const size = Array.isArray(data) ? data.length : 1;
  console.log(`- Wrote ${filename} (${size} records)`);
}

function loadCsv(inputDir: string, filename: string): CsvRow[] {
  const fullPath = join(inputDir, filename);
  if (!existsSync(fullPath)) {
    console.warn(`- Skip missing file: ${filename}`);
    return [];
  }

  const content = readFileSync(fullPath, "utf8");
  const rows = csvToObjects(content);
  console.log(`- Loaded ${filename} (${rows.length} rows)`);
  return rows;
}

function mapProducts(rows: CsvRow[]) {
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug || slugify(r.name || r.id),
    category: r.category,
    brand: r.brand,
    price: toNumber(r.price),
    discountPrice: r.discountPrice ? toNumber(r.discountPrice) : null,
    image: r.image || null,
    shortDesc: r.shortDesc || null,
    specs: parseJson<Record<string, string>>(r.specs, {}),
    stock: toNumber(r.stock),
    rating: toNumber(r.rating),
    reviewCount: toNumber(r.reviewCount, 0),
    tags: parseJson<string[]>(r.tags, []),
    compatKey: r.compatKey || null,
    status: r.status || "active",
  }));
}

function mapBuilds(rows: CsvRow[]) {
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug || slugify(r.name || r.id),
    purpose: r.purpose,
    price: toNumber(r.price),
    image: r.image || null,
    components: {
      cpu: r.cpu,
      gpu: r.gpu,
      mainboard: r.mainboard,
      ram: r.ram,
      storage: r.storage,
      psu: r.psu,
      case: r.case,
      cooler: r.cooler,
    },
    description: r.description || null,
    rating: toNumber(r.rating),
  }));
}

function mapCompatRules(rows: CsvRow[]) {
  return rows.map((r) => ({
    id: r.id,
    comp1Category: r.component1Category || r.comp1Category,
    comp2Category: r.component2Category || r.comp2Category,
    matchKey: r.matchKey,
    description: r.description,
  }));
}

function mapAssemblyGuides(rows: CsvRow[]) {
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug || slugify(r.title || r.id),
    difficulty: r.difficulty,
    estimatedTime: r.estimatedTime,
    tools: parseJson<string[]>(r.tools, []),
    steps: parseJson<Array<Record<string, unknown>>>(r.steps, []),
  }));
}

function mapFaq(rows: CsvRow[]) {
  return rows.map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
    category: r.category || null,
    tags: parseJson<string[]>(r.tags, []),
  }));
}

function mapReviews(rows: CsvRow[]) {
  return rows.map((r) => ({
    id: r.id,
    productId: r.productId,
    userId: r.userId,
    userName: r.userName,
    rating: toNumber(r.rating),
    title: r.title,
    content: r.content,
    pros: parseJson<string[]>(r.pros, []),
    cons: parseJson<string[]>(r.cons, []),
    verified: toBoolean(r.verified),
    status: r.status || "active",
    createdAt: r.createdAt || new Date().toISOString(),
  }));
}

function mapKnowledge(rows: CsvRow[]) {
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    content: r.content,
    tags: parseJson<string[]>(r.tags, []),
    source: r.source || null,
    createdAt: r.createdAt || new Date().toISOString(),
  }));
}

function writeGenericCsv(outDir: string, fileName: string, rows: CsvRow[]) {
  const generic = rows.map((row) => {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      const trimmed = String(value ?? "").trim();
      if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
        out[key] = parseJson(trimmed, trimmed);
      } else if (/^\d+(\.\d+)?$/.test(trimmed)) {
        out[key] = toNumber(trimmed);
      } else if (/^(true|false)$/i.test(trimmed)) {
        out[key] = toBoolean(trimmed);
      } else {
        out[key] = trimmed;
      }
    }
    return out;
  });

  writeJson(outDir, fileName.replace(/\.csv$/i, ".json"), generic);
}

function main() {
  const inputDir = getArg("input", "./frontend/data-export");
  const outputDir = getArg("output", "./scripts/seed-data");

  console.log(`CSV input directory : ${inputDir}`);
  console.log(`JSON output directory: ${outputDir}`);

  if (!existsSync(inputDir)) {
    throw new Error(`Input directory does not exist: ${inputDir}`);
  }

  mkdirSync(outputDir, { recursive: true });

  const products = loadCsv(inputDir, "products.csv");
  if (products.length) writeJson(outputDir, "products.json", mapProducts(products));

  const builds = loadCsv(inputDir, "prebuilt_pcs.csv");
  if (builds.length) writeJson(outputDir, "builds.json", mapBuilds(builds));

  const compat = loadCsv(inputDir, "compatibility_rules.csv");
  if (compat.length) writeJson(outputDir, "compat-rules.json", mapCompatRules(compat));

  const guides = loadCsv(inputDir, "assembly_guides.csv");
  if (guides.length) writeJson(outputDir, "assembly-guides.json", mapAssemblyGuides(guides));

  const faq = loadCsv(inputDir, "faq.csv");
  if (faq.length) writeJson(outputDir, "faq.json", mapFaq(faq));

  const reviews = loadCsv(inputDir, "reviews.csv");
  if (reviews.length) writeJson(outputDir, "reviews.json", mapReviews(reviews));

  const knowledge = loadCsv(inputDir, "knowledge.csv");
  if (knowledge.length) writeJson(outputDir, "knowledge.json", mapKnowledge(knowledge));

  // Convert any additional CSV files to generic JSON.
  const known = new Set([
    "products.csv",
    "prebuilt_pcs.csv",
    "compatibility_rules.csv",
    "assembly_guides.csv",
    "faq.csv",
    "reviews.csv",
    "knowledge.csv",
  ]);

  const dirEntries = readdirSync(inputDir);

  for (const fileName of dirEntries) {
    if (known.has(fileName)) continue;
    const full = join(inputDir, fileName);
    if (!existsSync(full) || !fileName.endsWith(".csv")) continue;
    const rows = loadCsv(inputDir, fileName);
    writeGenericCsv(outputDir, basename(fileName), rows);
  }

  console.log("CSV import completed.");
}

main();
