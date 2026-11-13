import { describe, expect, it } from "vitest";
import { buildNavigationUrl, canNavigateTo } from "./mapNavigation.util";

describe("buildNavigationUrl", () => {
  const pin = { latitude: 24.7136, longitude: 46.6753, query: "Olaya, Riyadh" };

  it("navigates to the exact pin when coordinates exist", () => {
    expect(buildNavigationUrl("google", pin)).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=24.7136%2C46.6753&travelmode=driving",
    );
    expect(buildNavigationUrl("waze", pin)).toBe(
      "https://waze.com/ul?ll=24.7136%2C46.6753&navigate=yes",
    );
    expect(buildNavigationUrl("apple", pin)).toBe(
      "https://maps.apple.com/?daddr=24.7136%2C46.6753&dirflg=d",
    );
  });

  it("falls back to the written address without coordinates", () => {
    const target = { latitude: null, longitude: null, query: "العليا، الرياض" };
    expect(buildNavigationUrl("google", target)).toBe(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("العليا، الرياض")}&travelmode=driving`,
    );
    expect(buildNavigationUrl("waze", target)).toContain("waze.com/ul?q=");
  });

  it("returns null when there is nowhere to go", () => {
    expect(canNavigateTo({ query: "  " })).toBe(false);
    expect(buildNavigationUrl("google", { query: "" })).toBeNull();
  });
});
