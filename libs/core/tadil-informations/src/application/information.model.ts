export enum InformationType {
  TEXT = 'text',
  NUMBER = 'number',
  SELECT_MENU = 'select_menu',
  CHECKBOX = 'checkbox',
}

export interface Information {
  id: string;
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
  extras: string[];
  isRequired: boolean;
  type: InformationType;
  unit?: string;
}
