import { describe, expect, it } from "vitest";
import { formatApplePayAmount, isApplePayCanceled } from "./applePay.util";

describe("isApplePayCanceled", () => {
  it("treats the native canceled code as a user dismiss", () => {
    expect(isApplePayCanceled({ code: "canceled", message: "canceled" })).toBe(true);
  });

  it("ignores payment failures", () => {
    expect(isApplePayCanceled({ code: "failed", message: "Insufficient funds" })).toBe(false);
    expect(isApplePayCanceled(new Error("Payment failed"))).toBe(false);
    expect(isApplePayCanceled(undefined)).toBe(false);
  });
});

describe("formatApplePayAmount", () => {
  it("formats SAR with two decimals for PassKit", () => {
    expect(formatApplePayAmount(12.5)).toBe("12.50");
    expect(formatApplePayAmount(10)).toBe("10.00");
    expect(formatApplePayAmount(19.999)).toBe("20.00");
  });
});
