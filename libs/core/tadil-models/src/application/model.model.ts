export interface Model {
  id: string;
  imageFileId: string;
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
  sections: Section[];
}

export interface Section {
  id: string;
  modelId: string;
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
