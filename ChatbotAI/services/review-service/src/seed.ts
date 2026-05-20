/**
 * Seed Review Service database
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
  console.log('Seeding Review Service database...');

  const reviews = loadJSON('reviews.json');
  let created = 0;

  for (const r of reviews) {
    await prisma.review.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        productId: r.productId,
        userId: r.userId,
        userName: r.userName,
        rating: r.rating,
        title: r.title,
        content: r.content,
        pros: r.pros,
        cons: r.cons,
        verified: r.verified,
        status: r.status,
        createdAt: new Date(r.createdAt),
      },
    });
    created++;
  }

  console.log(`  Reviews: ${created} upserted`);
  console.log('Review Service seeding complete!');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
