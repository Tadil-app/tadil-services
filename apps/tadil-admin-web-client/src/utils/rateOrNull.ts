/** A number input's value as a rate: empty clears it (null), so the global rate applies. */
export const rateOrNull = (value: unknown): number | null =>
  value === '' || value == null ? null : Number(value);
