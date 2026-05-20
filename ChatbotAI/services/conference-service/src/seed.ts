/**
 * Seed Order Service database (sample coupons)
 * Run: npm run seed
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding Order Service database...');

  // Sample coupons
  const coupons = [
    {
      id: 'coupon-welcome',
      code: 'WELCOME10',
      discountType: 'percent',
      discountValue: 10,
      minOrder: 1000000,
      maxDiscount: 500000,
      usageLimit: 1000,
      isActive: true,
    },
    {
      id: 'coupon-tet-2025',
      code: 'TET2025',
      discountType: 'percent',
      discountValue: 15,
      minOrder: 5000000,
      maxDiscount: 2000000,
      usageLimit: 500,
      expiresAt: new Date('2025-02-28'),
      isActive: true,
    },
    {
      id: 'coupon-freeship',
      code: 'FREESHIP',
      discountType: 'fixed',
      discountValue: 50000,
      minOrder: 500000,
      maxDiscount: null,
      usageLimit: 2000,
      isActive: true,
    },
    {
      id: 'coupon-vip',
      code: 'VIP20',
      discountType: 'percent',
      discountValue: 20,
      minOrder: 10000000,
      maxDiscount: 5000000,
      usageLimit: 100,
      isActive: true,
    },
    {
      id: 'coupon-blackfriday',
      code: 'BLACKFRIDAY',
      discountType: 'percent',
      discountValue: 25,
      minOrder: 3000000,
      maxDiscount: 3000000,
      usageLimit: 200,
      expiresAt: new Date('2025-11-30'),
      isActive: true,
    },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { id: c.id },
      update: {},
      create: c as any,
    });
  }
  console.log(`  Coupons: ${coupons.length} upserted`);

  console.log('Order Service seeding complete!');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
