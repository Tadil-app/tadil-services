import { describe, expect, it } from "vitest";
import { getPushOrderPath, isPushRole } from "./pushRoute.util";

describe("order push routes", () => {
  it("opens the order for the role the alert was meant for", () => {
    expect(getPushOrderPath("tailor", { type: "tailor.orderAvailable", reference: "TAD-123456" })).toBe(
      "/tailor/orders/TAD-123456",
    );
    expect(getPushOrderPath("courier", { type: "courier.returnAvailable", reference: "TAD 1" })).toBe(
      "/courier/orders/TAD%201",
    );
  });

  it("falls back to the order list without a reference", () => {
    expect(getPushOrderPath("courier", { type: "courier.pickupAvailable" })).toBe("/courier/orders");
  });

  it("ignores alerts for another role or an unknown payload", () => {
    expect(getPushOrderPath("tailor", { type: "courier.pickupAvailable", reference: "TAD-1" })).toBeUndefined();
    expect(getPushOrderPath("customer", { type: "tailor.orderAssigned", reference: "TAD-1" })).toBeUndefined();
    expect(getPushOrderPath("tailor", null)).toBeUndefined();
  });

  it("knows which roles get pushes", () => {
    expect(isPushRole("tailor")).toBe(true);
    expect(isPushRole("courier")).toBe(true);
    expect(isPushRole("customer")).toBe(false);
  });
});
