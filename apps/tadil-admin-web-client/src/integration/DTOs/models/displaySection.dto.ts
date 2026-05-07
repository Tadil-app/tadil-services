export interface Point {
  x: number;
  y: number;
}

export interface DisplaySectionDTO {
  id: string;
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
  coordinates: Point[];
  alterations: string[];
}
