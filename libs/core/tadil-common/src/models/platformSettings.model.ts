/** Admin-set money rules, stored as a single row. */
export interface PlatformSettings {
  /** Orders whose items reach this total ship free (SAR). 0 = not set. */
  freeDeliveryThreshold: number;
  /** Paid to the driver for each trip (SAR). */
  courierBasePayout: number;
  /** Tailor's share of the items total (%). */
  tailorCommissionRate: number;
  /** Delivery subsidy: share of the items total per trip that offsets the fee (%). */
  courierCommissionRate: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Transportation fee for an order. Every order is two trips (to the tailor
 * and back), so both the payout and the offset count twice.
 */
export function transportationFee(itemsTotal: number, s: PlatformSettings): number {
  if (s.freeDeliveryThreshold > 0 && itemsTotal >= s.freeDeliveryThreshold) return 0;
  const fee = s.courierBasePayout * 2 - (itemsTotal * s.courierCommissionRate * 2) / 100;
  return Math.max(0, round2(fee));
}

/** Tailor's net payout: their rate (own, else global) of the items total. */
export function tailorPayout(
  itemsTotal: number,
  ownRate: number | null | undefined,
  s: PlatformSettings
): number {
  return round2((itemsTotal * (ownRate ?? s.tailorCommissionRate)) / 100);
}
