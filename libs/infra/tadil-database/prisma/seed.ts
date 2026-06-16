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

function log(msg: string) {
  console.log(`[seed] ${msg}`);
}

async function main() {
  const startedAt = Date.now();
  log('Starting cities/districts seed ...');

  const cities = load<RawCity>('cities_lite.json');
  const districts = load<RawDistrict>('districts_lite.json');
  // GeoJSON Polygon per district, keyed by stringified district id.
  // Generated from the upstream geojson by build-boundaries.mjs.
  const boundaries = loadObject<BoundaryMap>('district_boundaries.json');
  log(`Data files: ${cities.length} cities, ${districts.length} districts.`);

  // createMany with skipDuplicates is a single bulk insert per table (one
  // connection, no connection-storm) and never wipes existing rows, so the
  // cities/districts list is never briefly emptied on deploy. Existing rows
  // are skipped by primary key; only genuinely new rows are inserted.
  const [citiesBefore, districtsBefore] = await Promise.all([
    prisma.city.count(),
    prisma.district.count(),
  ]);
  log(`Before insert: ${citiesBefore} cities, ${districtsBefore} districts in DB.`);

  const cityResult = await prisma.city.createMany({
    skipDuplicates: true,
    data: cities.map((c) => ({
      id: c.city_id,
      regionId: c.region_id,
      nameAr: c.name_ar,
      nameEn: c.name_en,
      nameBn: c.name_bn,
      nameHi: c.name_hi,
      nameUr: c.name_ur,
      lat: c.lat,
      lng: c.lng,
    })),
  });
  log(
    `Cities: +${cityResult.count} inserted, ${cities.length - cityResult.count} already present (skipped).`
  );

  let withBoundary = 0;
  const districtResult = await prisma.district.createMany({
    skipDuplicates: true,
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
        nameBn: d.name_bn,
        nameHi: d.name_hi,
        nameUr: d.name_ur,
        boundaries: boundary ?? undefined,
      };
    }),
  });
  log(
    `Districts: +${districtResult.count} inserted, ${districts.length - districtResult.count} already present (skipped); ${withBoundary}/${districts.length} have boundaries.`
  );

  const [citiesAfter, districtsAfter] = await Promise.all([
    prisma.city.count(),
    prisma.district.count(),
  ]);
  log(`After insert: ${citiesAfter} cities, ${districtsAfter} districts in DB.`);

  // The dataset is the source of truth, so the table should hold at least as
  // many rows as the file. Fewer means something is off (wrong DB, failed
  // insert) — surface it loudly rather than letting the app serve a short list.
  if (citiesAfter < cities.length || districtsAfter < districts.length) {
    log(
      `WARNING: row count is below the dataset (${citiesAfter}/${cities.length} cities, ${districtsAfter}/${districts.length} districts). The list may be incomplete.`
    );
  }

  log(`Seeding finished in ${((Date.now() - startedAt) / 1000).toFixed(1)}s.`);
}

main()
  .catch((e) => {
    console.error('[seed] Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
