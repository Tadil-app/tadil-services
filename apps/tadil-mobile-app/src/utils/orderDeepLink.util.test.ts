import { describe, expect, it } from "vitest";
import { createTailorOrderDeepLink, getTailorOrderPath } from "./orderDeepLink.util";

describe("tailor order deep links", () => {
  it("creates and parses an order deep link", () => {
    const link = createTailorOrderDeepLink("ORD 123");

    expect(link).toBe("tadil://tailor/orders/ORD%20123");
    expect(getTailorOrderPath(link)).toBe("/tailor/orders/ORD%20123");
  });

  it.each(["ORD-123", "https://example.com/tailor/orders/ORD-123", "tadil://customer/orders/ORD-123"])(
    "rejects unsupported link %s",
    (link) => expect(getTailorOrderPath(link)).toBeUndefined(),
  );
});
