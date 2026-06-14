import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { nearestPointOnLine } from "@turf/nearest-point-on-line";
import { multiLineString, point } from "@turf/helpers";

/** GeoJSON Polygon or MultiPolygon geometry as returned by the locations API. */
export interface BoundaryGeometry {
  type: "Polygon" | "MultiPolygon";
  // Polygon: number[][][]  (rings of [lng, lat])
  // MultiPolygon: number[][][][]
  coordinates: number[][][] | number[][][][];
}

export interface LatLng {
  lat: number;
  lng: number;
}

/** Flattens a Polygon/MultiPolygon into a flat list of its rings. */
function ringsOf(geom: BoundaryGeometry): number[][][] {
  return geom.type === "Polygon"
    ? (geom.coordinates as number[][][])
    : (geom.coordinates as number[][][][]).flat();
}

/** True if the lat/lng point falls inside the boundary geometry. */
export function isInsideBoundary(p: LatLng, geom: BoundaryGeometry): boolean {
  // turf works in [lng, lat] order.
  return booleanPointInPolygon([p.lng, p.lat], geom as never);
}

/**
 * Returns the point unchanged if it's inside the boundary, otherwise the
 * nearest point on the boundary edge (which counts as inside). Used to keep a
 * map pin constrained to the selected district/city.
 */
export function snapInsideBoundary(p: LatLng, geom: BoundaryGeometry): LatLng {
  if (isInsideBoundary(p, geom)) return p;
  const edges = multiLineString(ringsOf(geom));
  const snapped = nearestPointOnLine(edges, point([p.lng, p.lat]));
  const [lng, lat] = snapped.geometry.coordinates as [number, number];
  return { lat, lng };
}