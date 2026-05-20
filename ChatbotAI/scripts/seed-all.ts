/**
 * Master seed script — seeds ALL databases
 * 
 * Usage:
 *   1. Start PostgreSQL: docker compose up -d postgres
 *   2. Extract data:     cd frontend && npx tsx ../scripts/extract-data.ts
 *   3. Run migrations:   (see commands below)
 *   4. Run seed:         node scripts/seed-all.js (or tsx scripts/seed-all.ts)
 * 
 * Or run individual service seeds:
 *   cd services/auth-service && npx prisma db push && npm run seed
 *   cd services/paper-service && npx prisma db push && npm run seed
 *   cd services/review-service && npx prisma db push && npm run seed
 *   cd services/conference-service && npx prisma db push && npm run seed
 */

import { execSync } from 'child_process';
import { join } from 'path';

const root = join(__dirname, '..');

const services = [
  { name: 'Auth Service', dir: 'services/auth-service' },
  { name: 'Product Service', dir: 'services/paper-service' },
  { name: 'Review Service', dir: 'services/review-service' },
  { name: 'Order Service', dir: 'services/conference-service' },
];

function run(cmd: string, cwd: string) {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { cwd: join(root, cwd), stdio: 'inherit' });
}

async function main() {
  console.log('=== Importing CSV data to JSON seed files ===');
  run('npx tsx scripts/import-csv.ts', '.');

  for (const svc of services) {
    console.log(`\n=== ${svc.name} ===`);
    try {
      console.log('  Pushing schema...');
      run('npx prisma db push --skip-generate', svc.dir);
      console.log('  Generating client...');
      run('npx prisma generate', svc.dir);
      console.log('  Seeding...');
      run('npm run seed', svc.dir);
    } catch (err) {
      console.error(`  Error seeding ${svc.name}:`, err);
    }
  }

  console.log('\n=== All databases seeded! ===');
}

main();
