import { describe, expect, it } from "vitest";
import { moyasarFormMethods } from "./moyasarForm.util";

describe("moyasarFormMethods", () => {
  it("keeps STC Pay on native apps with the card form", () => {
    expect(
      moyasarFormMethods({ nativeApp: true, googlePay: true })
    ).toEqual(["creditcard", "stcpay"]);
    expect(
      moyasarFormMethods({ nativeApp: true, googlePay: false })
    ).toEqual(["creditcard", "stcpay"]);
  });

  it("offers STC Pay with Apple Pay on the hosted website", () => {
    expect(
      moyasarFormMethods({ nativeApp: false, googlePay: false })
    ).toEqual(["creditcard", "stcpay", "applepay"]);
  });

  it("adds Google Pay on the hosted website when configured", () => {
    expect(
      moyasarFormMethods({ nativeApp: false, googlePay: true })
    ).toEqual(["creditcard", "stcpay", "applepay", "googlepay"]);
  });
});
