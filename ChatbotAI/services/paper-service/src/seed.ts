/**
 * Seed Product Service database
 * Run: npm run seed
 */
import { PrismaClient } from '@prisma/client';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();
const dataDir = join(__dirname, '../../scripts/seed-data');

function loadJSON(filename: string): any[] {
  const filepath = join(dataDir, filename);
  if (!existsSync(filepath)) {
    console.error(`File not found: ${filepath}`);
    console.error('Run data extraction first: cd frontend && npx tsx ../scripts/extract-data.ts');
    process.exit(1);
  }
  return JSON.parse(readFileSync(filepath, 'utf8'));
}

async function seed() {
  console.log('Seeding Product Service database...');

  // Products
  const products = loadJSON('products.json');
  let created = 0;
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        brand: p.brand,
        price: p.price,
        discountPrice: p.discountPrice,
        image: p.image,
        shortDesc: p.shortDesc,
        specs: p.specs,
        stock: p.stock,
        rating: p.rating,
        reviewCount: p.reviewCount,
        tags: p.tags,
        compatKey: p.compatKey,
        status: p.status,
      },
    });
    created++;
  }
  console.log(`  Products: ${created} upserted`);

  // Prebuilt PCs
  const builds = loadJSON('builds.json');
  created = 0;
  for (const b of builds) {
    await prisma.prebuiltPC.upsert({
      where: { id: b.id },
      update: {},
      create: {
        id: b.id,
        name: b.name,
        slug: b.slug,
        purpose: b.purpose,
        price: b.price,
        image: b.image,
        components: b.components,
        description: b.description,
        rating: b.rating,
      },
    });
    created++;
  }
  console.log(`  Prebuilt PCs: ${created} upserted`);

  // Compat Rules
  const compatRules = loadJSON('compat-rules.json');
  created = 0;
  for (const r of compatRules) {
    await prisma.compatRule.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        comp1Category: r.comp1Category,
        comp2Category: r.comp2Category,
        matchKey: r.matchKey,
        description: r.description,
      },
    });
    created++;
  }
  console.log(`  Compat Rules: ${created} upserted`);

  // Assembly Guides
  const guides = loadJSON('assembly-guides.json');
  created = 0;
  for (const g of guides) {
    await prisma.assemblyGuide.upsert({
      where: { id: g.id },
      update: {},
      create: {
        id: g.id,
        title: g.title,
        slug: g.slug,
        difficulty: g.difficulty,
        estimatedTime: g.estimatedTime,
        tools: g.tools,
        steps: g.steps,
      },
    });
    created++;
  }
  console.log(`  Assembly Guides: ${created} upserted`);

  // FAQ
  const faq = loadJSON('faq.json');
  created = 0;
  for (const f of faq) {
    await prisma.fAQ.upsert({
      where: { id: f.id },
      update: {},
      create: {
        id: f.id,
        question: f.question,
        answer: f.answer,
        category: f.category,
        tags: f.tags,
      },
    });
    created++;
  }
  console.log(`  FAQ: ${created} upserted`);

  // Knowledge
  const knowledge = loadJSON('knowledge.json');
  created = 0;
  for (const k of knowledge) {
    await prisma.knowledge.upsert({
      where: { id: k.id },
      update: {},
      create: {
        id: k.id,
        title: k.title,
        content: k.content,
        tags: k.tags,
        source: k.source,
      },
    });
    created++;
  }
  console.log(`  Knowledge: ${created} upserted`);

  console.log('Product Service seeding complete!');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
