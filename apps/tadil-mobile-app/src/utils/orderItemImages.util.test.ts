import { describe, expect, it } from "vitest";
import { groupOrderItemSectionImages } from "./orderItemImages.util";
import type { DisplayOrderItemDTO } from "@/integration/dtos";

function section(
  id: string,
  imageFileUrl?: string,
): DisplayOrderItemDTO["sections"][number] {
  return {
    id,
    englishName: id,
    arabicName: id,
    urduName: id,
    hindiName: id,
    bengaliName: id,
    coordinates: [{ x: 1, y: 1 }],
    imageFileUrl,
    alterations: [],
  };
}

describe("groupOrderItemSectionImages", () => {
  it("groups sections by their own image when present", () => {
    const item = {
      imageFileUrl: "https://cdn/thumbnail.jpg",
      sections: [
        section("sleeves", "https://cdn/front.jpg"),
        section("hem", "https://cdn/front.jpg"),
        section("back", "https://cdn/back.jpg"),
      ],
    } as DisplayOrderItemDTO;

    expect(groupOrderItemSectionImages(item)).toEqual([
      {
        imageUrl: "https://cdn/front.jpg",
        sections: [item.sections[0], item.sections[1]],
      },
      {
        imageUrl: "https://cdn/back.jpg",
        sections: [item.sections[2]],
      },
    ]);
  });

  it("falls back to the item thumbnail when a section has no image", () => {
    const item = {
      imageFileUrl: "https://cdn/thumbnail.jpg",
      sections: [section("collar")],
    } as DisplayOrderItemDTO;

    expect(groupOrderItemSectionImages(item)).toEqual([
      {
        imageUrl: "https://cdn/thumbnail.jpg",
        sections: [item.sections[0]],
      },
    ]);
  });
});
