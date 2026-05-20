/**
 * Extract frontend mega data to JSON files for database seeding
 * Run: npx tsx scripts/extract-data.ts
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Import from frontend
import { ALL_MEGA_PRODUCTS } from '../frontend/src/lib/data/mega-products';
import { MEGA_PREBUILT_PCS, MEGA_COMPAT_RULES, MEGA_ASSEMBLY_GUIDES } from '../frontend/src/lib/data/mega-builds';
import { MEGA_FAQ } from '../frontend/src/lib/data/mega-faq';
import { MEGA_REVIEWS } from '../frontend/src/lib/data/mega-reviews';
import { MEGA_KNOWLEDGE } from '../frontend/src/lib/data/mega-knowledge';

const outDir = join(__dirname, 'seed-data');
mkdirSync(outDir, { recursive: true });

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Products
const products = ALL_MEGA_PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  slug: slugify(p.name),
  category: p.category,
  brand: p.brand,
  price: p.price,
  discountPrice: p.discountPrice || null,
  image: p.image || null,
  shortDesc: p.shortDesc || null,
  specs: p.specs || {},
  stock: p.stock,
  rating: p.rating,
  reviewCount: 0,
  tags: p.tags || [],
  compatKey: p.compatKey || null,
  status: 'active',
}));
writeFileSync(join(outDir, 'products.json'), JSON.stringify(products, null, 2));
console.log(`Exported ${products.length} products`);

// Prebuilt PCs
const builds = MEGA_PREBUILT_PCS.map(b => ({
  id: b.id,
  name: b.name,
  slug: slugify(b.name),
  purpose: b.purpose,
  price: b.price,
  image: b.image || null,
  components: b.components,
  description: b.description || null,
  rating: b.rating,
}));
writeFileSync(join(outDir, 'builds.json'), JSON.stringify(builds, null, 2));
console.log(`Exported ${builds.length} builds`);

// Compat Rules
const compatRules = MEGA_COMPAT_RULES.map(r => ({
  id: r.id,
  comp1Category: r.component1Category,
  comp2Category: r.component2Category,
  matchKey: r.matchKey,
  description: r.description,
}));
writeFileSync(join(outDir, 'compat-rules.json'), JSON.stringify(compatRules, null, 2));
console.log(`Exported ${compatRules.length} compat rules`);

// Assembly Guides
const guides = MEGA_ASSEMBLY_GUIDES.map(g => ({
  id: g.id,
  title: g.title,
  slug: slugify(g.title),
  difficulty: g.difficulty,
  estimatedTime: g.estimatedTime,
  tools: g.tools,
  steps: g.steps,
}));
writeFileSync(join(outDir, 'assembly-guides.json'), JSON.stringify(guides, null, 2));
console.log(`Exported ${guides.length} assembly guides`);

// FAQ
const faq = MEGA_FAQ.map(f => ({
  id: f.id,
  question: f.question,
  answer: f.answer,
  category: f.category || null,
  tags: f.tags || [],
}));
writeFileSync(join(outDir, 'faq.json'), JSON.stringify(faq, null, 2));
console.log(`Exported ${faq.length} FAQ items`);

// Reviews
const reviews = MEGA_REVIEWS.map(r => ({
  id: r.id,
  productId: r.productId,
  userId: r.userId,
  userName: r.userName,
  rating: r.rating,
  title: r.title,
  content: r.content,
  pros: r.pros || [],
  cons: r.cons || [],
  verified: r.verified,
  status: 'active',
  createdAt: r.createdAt,
}));
writeFileSync(join(outDir, 'reviews.json'), JSON.stringify(reviews, null, 2));
console.log(`Exported ${reviews.length} reviews`);

// Knowledge
const knowledge = MEGA_KNOWLEDGE.map(k => ({
  id: k.id,
  title: k.title,
  content: k.content,
  tags: k.tags || [],
  source: k.source || null,
  createdAt: k.createdAt,
}));
writeFileSync(join(outDir, 'knowledge.json'), JSON.stringify(knowledge, null, 2));
console.log(`Exported ${knowledge.length} knowledge items`);

console.log('\nAll data exported to scripts/seed-data/');
