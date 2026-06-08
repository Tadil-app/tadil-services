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
  lat: number | null;
  lng: number | null;
}

interface RawDistrict {
  district_id: number;
  city_id: number;
  region_id: number;
  name_ar: string;
  name_en: string;
}

type Boundary = { type: 'Polygon'; coordinates: number[][][] };
type BoundaryMap = Record<string, Boundary>;

function load<T>(file: string): T[] {
  return JSON.parse(readFileSync(join(dataDir, file), 'utf-8')) as T[];
}

function loadObject<T>(file: string): T {
  return JSON.parse(readFileSync(join(dataDir, file), 'utf-8')) as T;
}

async function main() {
  console.log('Seeding Saudi cities and districts ...');

  const cities = load<RawCity>('cities_lite.json');
  const districts = load<RawDistrict>('districts_lite.json');
  // GeoJSON Polygon per district, keyed by stringified district id.
  // Generated from the upstream geojson by build-boundaries.mjs.
  const boundaries = loadObject<BoundaryMap>('district_boundaries.json');

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
      lat: c.lat,
      lng: c.lng,
    })),
  });
  console.log(`Inserted ${cities.length} cities.`);

  let withBoundary = 0;
  await prisma.district.createMany({
    data: districts.map((d) => {
      const id = String(d.district_id);
      const boundary = boundaries[id] ?? null;
      if (boundary) withBoundary++;
      return {
        id,
        cityId: d.city_id,
        regionId: d.region_id,
        nameAr: d.name_ar,
        nameEn: d.name_en,
        boundaries: boundary ?? undefined,
      };
    }),
  });
  console.log(
    `Inserted ${districts.length} districts (${withBoundary} with boundaries).`
  );

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
