import type { ModelCategory } from ".";

export interface DisplayModelDTO {
  id: string;
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
  category: ModelCategory;
  thumbNailImageBase64String?: string;
}
