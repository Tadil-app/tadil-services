export interface Model {
  id: string;
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
  category: ModelCategory;
  images: ModelImage[];
}

export enum ModelCategory {
  ALL = 'all',
  MEN = 'men',
  WOMEN = 'women',
  KIDS = 'kids',
}

export interface ModelImage {
  id: string;
  modelId: string;
  fileId: string;
  sections: Section[];
}

export interface Section {
  id: string;
  modelImageId: string;
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
  coordinates: Point[];
  alterations: string[];
}

export interface Point {
  x: number;
  y: number;
}
