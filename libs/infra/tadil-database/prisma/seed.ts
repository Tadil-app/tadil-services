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
  name_bn: string;
  name_hi: string;
  name_ur: string;
  lat: number | null;
  lng: number | null;
}

interface RawDistrict {
  district_id: number;
  city_id: number;
  region_id: number;
  name_ar: string;
  name_en: string;
  name_bn: string;
  name_hi: string;
  name_ur: string;
}

type Boundary = { type: 'Polygon'; coordinates: number[][][] };
type BoundaryMap = Record<string, Boundary>;

function load<T>(file: string): T[] {
  return JSON.parse(readFileSync(join(dataDir, file), 'utf-8')) as T[];
}

function loadObject<T>(file: string): T {
  return JSON.parse(readFileSync(join(dataDir, file), 'utf-8')) as T;
}

// Upserts run one query per row, so run them in bounded batches to avoid
// opening thousands of connections at once.
const BATCH_SIZE = 200;

async function inBatches<T>(items: T[], fn: (item: T) => Promise<unknown>) {
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    await Promise.all(items.slice(i, i + BATCH_SIZE).map(fn));
  }
}

async function main() {
  console.log('Seeding Saudi cities and districts ...');

  const cities = load<RawCity>('cities_lite.json');
  const districts = load<RawDistrict>('districts_lite.json');
  // GeoJSON Polygon per district, keyed by stringified district id.
  // Generated from the upstream geojson by build-boundaries.mjs.
  const boundaries = loadObject<BoundaryMap>('district_boundaries.json');

  // Upsert by id so the seed is idempotent without wiping the tables (a
  // delete+reinsert would briefly empty the list on every deploy). Address
  // stores names as strings with no FK to these tables, so rows that are no
  // longer in the dataset are simply left in place.
  await inBatches(cities, (c) => {
    const data = {
      regionId: c.region_id,
      nameAr: c.name_ar,
      nameEn: c.name_en,
      nameBn: c.name_bn,
      nameHi: c.name_hi,
      nameUr: c.name_ur,
      lat: c.lat,
      lng: c.lng,
    };
    return prisma.city.upsert({
      where: { id: c.city_id },
      create: { id: c.city_id, ...data },
      update: data,
    });
  });
  console.log(`Upserted ${cities.length} cities.`);

  let withBoundary = 0;
  await inBatches(districts, (d) => {
    const id = String(d.district_id);
    const boundary = boundaries[id] ?? null;
    if (boundary) withBoundary++;
    const data = {
      cityId: d.city_id,
      regionId: d.region_id,
      nameAr: d.name_ar,
      nameEn: d.name_en,
      nameBn: d.name_bn,
      nameHi: d.name_hi,
      nameUr: d.name_ur,
      boundaries: boundary ?? undefined,
    };
    return prisma.district.upsert({
      where: { id },
      create: { id, ...data },
      update: data,
    });
  });
  console.log(
    `Upserted ${districts.length} districts (${withBoundary} with boundaries).`
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
