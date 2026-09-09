import { Capacitor } from "@capacitor/core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolveMediaSrc } from "./media.util";

describe("resolveMediaSrc", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it.each(["/api/files/model.jpg", "/images/categories/women.jpeg", "https://api.example.com/model.jpg"])(
    "keeps web URL %s unchanged",
    (url) => {
      expect(resolveMediaSrc(url)).toBe(url);
    },
  );

  it.each(["file:///model.jpg", "content://model.jpg"])(
    "converts native URL %s",
    (url) => {
      vi.spyOn(Capacitor, "convertFileSrc").mockReturnValue("capacitor://model.jpg");
      expect(resolveMediaSrc(url)).toBe("capacitor://model.jpg");
      expect(Capacitor.convertFileSrc).toHaveBeenCalledWith(url);
    },
  );
});
