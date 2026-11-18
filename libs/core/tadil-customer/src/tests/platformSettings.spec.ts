import { tailorPayout, transportationFee } from '@tadil-common';

const s = {
  freeDeliveryThreshold: 150,
  courierBasePayout: 7.5,
  tailorCommissionRate: 10,
  courierCommissionRate: 6.5,
};

describe('transportationFee', () => {
  it('matches the spec example: (7.5 * 2) - (100 * 13%) = 2', () => {
    expect(transportationFee(100, s)).toBe(2);
  });
  it('is free at or above the threshold', () => {
    expect(transportationFee(150, s)).toBe(0);
    expect(transportationFee(400, s)).toBe(0);
  });
  it('treats a 0 threshold as not set', () => {
    expect(transportationFee(100, { ...s, freeDeliveryThreshold: 0 })).toBe(2);
  });
  it('never goes negative', () => {
    expect(transportationFee(140, { ...s, courierCommissionRate: 20 })).toBe(0);
  });
});

describe('tailorPayout', () => {
  it('uses the tailor own rate, else the global one', () => {
    expect(tailorPayout(100, 20, s)).toBe(20);
    expect(tailorPayout(100, null, s)).toBe(10);
    expect(tailorPayout(100, 0, s)).toBe(0);
  });
});
