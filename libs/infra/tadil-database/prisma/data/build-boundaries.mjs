// Builds `district_boundaries.json` ({ districtId: GeoJSON Polygon geometry })
// from the upstream homaily districts.geojson. Polygons are simplified with
// Douglas–Peucker to keep payloads mobile-friendly (the full set is ~22 MB).
//
// Usage:
//   node build-boundaries.mjs              # downloads the geojson if missing
//   node build-boundaries.mjs <path.geojson>
//
// Source: https://github.com/homaily/Saudi-Arabia-Regions-Cities-and-Districts
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SRC_URL =
  'https://raw.githubusercontent.com/homaily/Saudi-Arabia-Regions-Cities-and-Districts/master/geojson/districts.geojson';
// ~0.0004 deg ≈ ~40 m. Plenty precise for an "is the pin in this area" test
// while cutting the vertex count (and payload) by a large factor.
const TOLERANCE = 0.0004;

// Perpendicular distance from point p to the segment a-b (planar; fine at city scale).
function perpDist(p, a, b) {
  const [px, py] = p;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
  const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function douglasPeucker(points, tol) {
  if (points.length < 3) return points;
  let maxDist = 0;
  let idx = 0;
  const end = points.length - 1;
  for (let i = 1; i < end; i++) {
    const d = perpDist(points[i], points[0], points[end]);
    if (d > maxDist) {
      maxDist = d;
      idx = i;
    }
  }
  if (maxDist > tol) {
    const left = douglasPeucker(points.slice(0, idx + 1), tol);
    const right = douglasPeucker(points.slice(idx), tol);
    return left.slice(0, -1).concat(right);
  }
  return [points[0], points[end]];
}

function simplifyRing(ring) {
  // Ring is a closed array of [lng, lat]; keep it closed and never below a triangle.
  const simplified = douglasPeucker(ring, TOLERANCE);
  if (simplified.length < 4) return ring; // too small to simplify safely
  const first = simplified[0];
  const last = simplified[simplified.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) simplified.push(first);
  return simplified;
}

async function loadGeoJson() {
  const argPath = process.argv[2];
  const candidates = [
    argPath,
    join(here, 'districts.geojson'),
    join(process.env.TEMP || process.env.TMP || '/tmp', 'districts.geojson'),
  ].filter(Boolean);
  for (const c of candidates) {
    if (existsSync(c)) {
      console.log(`Reading ${c}`);
      return JSON.parse(readFileSync(c, 'utf-8'));
    }
  }
  console.log(`Downloading ${SRC_URL} ...`);
  const res = await fetch(SRC_URL);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  return await res.json();
}

async function main() {
  const gj = await loadGeoJson();
  const out = {};
  let beforePts = 0;
  let afterPts = 0;
  for (const f of gj.features) {
    const id = String(f.properties.district_id);
    const rings = f.geometry.coordinates.map((ring) => {
      beforePts += ring.length;
      const s = simplifyRing(ring);
      afterPts += s.length;
      return s;
    });
    out[id] = { type: 'Polygon', coordinates: rings };
  }
  const target = join(here, 'district_boundaries.json');
  writeFileSync(target, JSON.stringify(out));
  const bytes = readFileSync(target).length;
  console.log(
    `Wrote ${Object.keys(out).length} district boundaries to ${target}\n` +
      `Vertices ${beforePts} -> ${afterPts} (${((1 - afterPts / beforePts) * 100).toFixed(1)}% reduction)\n` +
      `File size: ${(bytes / 1024 / 1024).toFixed(2)} MB`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
