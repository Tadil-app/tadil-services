export interface Model {
  id: string;
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
  category?: string;
  images: ModelImage[];
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
}

export interface Point {
  x: number;
  y: number;
}
