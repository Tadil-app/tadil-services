import type { Point } from ".";

export interface UpdateSectionDTO {
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
  coordinates: Point[];
  alterations: string[];
}
