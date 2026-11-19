import { describe, expect, it } from "vitest";
import {
  formatGooglePayAmount,
  googlePayEnvironment,
  isGooglePayCanceled,
} from "./googlePay.util";

describe("isGooglePayCanceled", () => {
  it("treats the native canceled code as a user dismiss", () => {
    expect(isGooglePayCanceled({ code: "canceled", message: "canceled" })).toBe(
      true
    );
  });

  it("ignores payment failures", () => {
    expect(
      isGooglePayCanceled({ code: "failed", message: "Insufficient funds" })
    ).toBe(false);
    expect(isGooglePayCanceled(new Error("Payment failed"))).toBe(false);
    expect(isGooglePayCanceled(undefined)).toBe(false);
  });
});

describe("formatGooglePayAmount", () => {
  it("formats SAR with two decimals for Google Pay", () => {
    expect(formatGooglePayAmount(12.5)).toBe("12.50");
    expect(formatGooglePayAmount(10)).toBe("10.00");
    expect(formatGooglePayAmount(19.999)).toBe("20.00");
  });
});

describe("googlePayEnvironment", () => {
  it("uses PRODUCTION only with a live Moyasar key", () => {
    expect(googlePayEnvironment("pk_live_abc")).toBe("PRODUCTION");
    expect(googlePayEnvironment("pk_test_abc")).toBe("TEST");
    expect(googlePayEnvironment(undefined)).toBe("TEST");
  });
});
