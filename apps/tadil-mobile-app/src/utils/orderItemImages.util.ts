import type { DisplayOrderItemDTO, DisplayOrderItemSectionDTO } from "@/integration/dtos";

export function groupOrderItemSectionImages(item: DisplayOrderItemDTO): {
  imageUrl: string;
  sections: DisplayOrderItemSectionDTO[];
}[] {
  const groups = new Map<string, DisplayOrderItemSectionDTO[]>();

  for (const section of item.sections) {
    const imageUrl = section.imageFileUrl || item.imageFileUrl;
    const sections = groups.get(imageUrl) ?? [];
    sections.push(section);
    groups.set(imageUrl, sections);
  }

  return Array.from(groups.entries()).map(([imageUrl, sections]) => ({
    imageUrl,
    sections,
  }));
}
