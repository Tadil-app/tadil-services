import type { DisplayModelDTO, Point } from "@/integration/dtos";

export interface TranslatedNameObject {
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
}

export interface SelectedAlteration {
  alterationId: string;
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
  price: number;
  informations: {
    informationId: string;
    englishName: string;
    arabicName: string;
    hindiName: string;
    urduName: string;
    bengaliName: string;
    value?: string;
    unit?: string;
  }[];
}

export interface SelectedSection {
  sectionId: string;
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
  coordinates: Point[];
  alterations: SelectedAlteration[];
}

export interface SelectedImage {
  modelImageId: string;
  imageUrl: string;
  sections: SelectedSection[];
}

export interface CartItemConfiguration {
  modelId: string;
  modelImages: SelectedImage[];
}

export type ModelItems = CartItemConfiguration;

export interface CartItem {
  id: string;
  model: DisplayModelDTO;
  configuration: CartItemConfiguration;
}
