// One-time data-prep: enrich cities_lite.json with center coordinates.
// Source: homaily/Saudi-Arabia-Regions-Cities-and-Districts (cities.json -> `center: [lat, lng]`).
// Run from anywhere: `node enrich-coords.mjs`. Network is only needed here, never at seed time.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dataDir = dirname(fileURLToPath(import.meta.url));
const SOURCE =
  'https://raw.githubusercontent.com/homaily/Saudi-Arabia-Regions-Cities-and-Districts/master/json/cities.json';

const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`Failed to fetch source cities.json: ${res.status}`);
const source = await res.json();

const centerById = new Map(
  source.map((c) => [c.city_id, Array.isArray(c.center) ? c.center : null])
);

const file = join(dataDir, 'cities_lite.json');
const cities = JSON.parse(readFileSync(file, 'utf-8'));

let withCoords = 0;
for (const city of cities) {
  const center = centerById.get(city.city_id);
  if (center && center.length === 2) {
    city.lat = center[0];
    city.lng = center[1];
    withCoords += 1;
  } else {
    city.lat = null;
    city.lng = null;
  }
}

writeFileSync(file, JSON.stringify(cities, null, 2) + '\n', 'utf-8');
console.log(`Enriched ${withCoords}/${cities.length} cities with coordinates.`);
