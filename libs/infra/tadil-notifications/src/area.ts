/** The parts of an address that decide who serves an order. */
export interface ServiceArea {
  cityId: number | null;
  cityNameEn: string;
  districtId: string | null;
  districtNameEn: string | null;
}

/**
 * Whether a tailor or driver whose own address is `worker` sees an order at
 * `order` in their list. Mirrors the filters of the tailor and courier order
 * endpoints, so a push only reaches people who can act on the order:
 *
 * - the city must match (by id when the worker has one, else by name);
 * - a district narrows the city only when BOTH sides have one, and then they
 *   must match (by id when the worker has one, else by name).
 */
export function servesArea(worker: ServiceArea, order: ServiceArea): boolean {
  const sameCity =
    worker.cityId != null
      ? order.cityId === worker.cityId
      : order.cityNameEn === worker.cityNameEn;
  if (!sameCity) return false;

  const workerHasDistrict = worker.districtId != null || worker.districtNameEn != null;
  if (!workerHasDistrict) return true;

  const orderHasDistrict = order.districtId != null || order.districtNameEn != null;
  if (!orderHasDistrict) return true;

  return worker.districtId != null
    ? order.districtId === worker.districtId
    : order.districtNameEn === worker.districtNameEn;
}
