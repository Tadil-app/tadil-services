import type { InformationType } from ".";

export interface CreateInformationDTO {
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
  isRequired: boolean;
  type: InformationType;
  extras: string[];
  unit: string;
}
