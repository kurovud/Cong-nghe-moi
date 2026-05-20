/**
 * Seed Auth Service database (admin user + demo data)
 * Run: npm run seed
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding Auth Service database...');

  const passwordHash = await bcrypt.hash('Admin@123', 12);

  // Admin user
  await prisma.user.upsert({
    where: { email: 'admin@pcshop.vn' },
    update: {},
    create: {
      email: 'admin@pcshop.vn',
      password: passwordHash,
      name: 'Admin PC Shop',
      phone: '0901234567',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('  Admin user: admin@pcshop.vn / Admin@123');

  // Demo user
  const demoHash = await bcrypt.hash('User@123', 12);
  await prisma.user.upsert({
    where: { email: 'user@pcshop.vn' },
    update: {},
    create: {
      email: 'user@pcshop.vn',
      password: demoHash,
      name: 'Người dùng Demo',
      phone: '0987654321',
      role: 'USER',
      status: 'ACTIVE',
      addresses: {
        create: {
          fullName: 'Người dùng Demo',
          phone: '0987654321',
          province: 'TP. Hồ Chí Minh',
          district: 'Quận 1',
          ward: 'Phường Bến Nghé',
          street: '123 Nguyễn Huệ',
          isDefault: true,
        },
      },
    },
  });
  console.log('  Demo user: user@pcshop.vn / User@123');

  const staffHash = await bcrypt.hash('Staff@123', 12);
  await prisma.user.upsert({
    where: { email: 'staff@pcshop.vn' },
    update: {},
    create: {
      email: 'staff@pcshop.vn',
      password: staffHash,
      name: 'Nhân viên Demo',
      phone: '0911222333',
      role: 'STAFF',
      status: 'ACTIVE',
    },
  });
  console.log('  Staff user: staff@pcshop.vn / Staff@123');

  console.log('Auth Service seeding complete!');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
