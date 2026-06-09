/** A GeoJSON geometry describing an administrative area's boundary. */
export interface DisplayBoundaryDTO {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
}