import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const prisma = new PrismaClient();

const dataDir = join(dirname(fileURLToPath(import.meta.url)), 'data');

interface RawCity {
  city_id: number;
  region_id: number;
  name_ar: string;
  name_en: string;
}

interface RawDistrict {
  district_id: number;
  city_id: number;
  region_id: number;
  name_ar: string;
  name_en: string;
}

function load<T>(file: string): T[] {
  return JSON.parse(readFileSync(join(dataDir, file), 'utf-8')) as T[];
}

async function main() {
  console.log('Seeding Saudi cities and districts ...');

  const cities = load<RawCity>('cities_lite.json');
  const districts = load<RawDistrict>('districts_lite.json');

  // Address stores names as strings (no FK to these tables), so a clean
  // wipe + reinsert keeps the seed idempotent without touching addresses.
  await prisma.district.deleteMany();
  await prisma.city.deleteMany();

  await prisma.city.createMany({
    data: cities.map((c) => ({
      id: c.city_id,
      regionId: c.region_id,
      nameAr: c.name_ar,
      nameEn: c.name_en,
    })),
  });
  console.log(`Inserted ${cities.length} cities.`);

  await prisma.district.createMany({
    data: districts.map((d) => ({
      id: String(d.district_id),
      cityId: d.city_id,
      regionId: d.region_id,
      nameAr: d.name_ar,
      nameEn: d.name_en,
    })),
  });
  console.log(`Inserted ${districts.length} districts.`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
