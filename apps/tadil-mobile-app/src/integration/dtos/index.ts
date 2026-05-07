export enum InformationType {
  Text = "text",
  Number = "number",
  SelectMenu = "select_menu",
  Checkbox = "checkbox",
}

export enum ModelCategory {
  All = "all",
  Men = "men",
  Women = "women",
  Kids = "kids",
}
export const ORDER_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "inProgress",
  COMPLETED: "completed",
  WAITING_FOR_PICKUP: "waitingForPickup",
};
export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export interface DisplayModelDTO {
  id: string;
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
  category: ModelCategory;
  thumbnailImageUrl?: string;
}

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
}

export interface DisplayModelImageDTO {
  id: string;
  imageUrl: string;
  sections: DisplaySectionDTO[];
}

export interface DisplayExtraDTO {
  id: string;
  englishName: string;
  arabicName: string;
  urduName: string;
  hindiName: string;
  bengaliName: string;
  price: number;
}

export interface DisplayInformationDTO {
  id: string;
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
  isRequired: boolean;
  type: InformationType;
  extras: DisplayExtraDTO[];
  unit?: string;
  value?: string;
}

export interface DisplayAlterationDTO {
  id: string;
  englishName: string;
  arabicName: string;
  urduName: string;
  hindiName: string;
  bengaliName: string;
  price: number;
  informations: DisplayInformationDTO[];
}

export interface DisplayOrderDtoPoint {
  x: number;
  y: number;
}

export interface DisplayItemInformationDTO {
  id: string;
  englishName: string;
  arabicName: string;
  urduName: string;
  hindiName: string;
  bengaliName: string;
  type: object;
  unit: string;
  value: string;
}

export interface DisplayItemAlterationDTO {
  id: string;
  englishName: string;
  arabicName: string;
  urduName: string;
  hindiName: string;
  bengaliName: string;
  price: number;
  customCoordinates: DisplayOrderDtoPoint[];
  informations: DisplayItemInformationDTO[];
}

export interface DisplayOrderItemSectionDTO {
  id: string;
  englishName: string;
  arabicName: string;
  urduName: string;
  hindiName: string;
  bengaliName: string;
  coordinates: string[];
  alterations: DisplayItemAlterationDTO[];
}

export interface DisplayOrderItemDTO {
  id: string;
  englishName: string;
  arabicName: string;
  urduName: string;
  hindiName: string;
  bengaliName: string;
  imageFileUrl: string;
  price: number;
  sections: DisplayOrderItemSectionDTO[];
}

export interface DisplayCustomOrderItemDTO {
  id: string;
  price: number;
  imageFileUrl: string;
  alterations: DisplayItemAlterationDTO[];
}

export interface DisplayOrderDTO {
  id: string;
  customerId: string;
  reference: string;
  date: string;
  totalPrice: number;
  status: OrderStatusType;
  items: DisplayOrderItemDTO[];
  customItems: DisplayCustomOrderItemDTO[];
}

export interface LoginDto {
  phone: string;
}

export interface CompleteProfileDto {
  phone: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponseDto {
  status: "authenticated" | "signup_required" | "pending" | "rejected";
  token?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: "tailor" | "customer" | "courier";
    email?: string;
  };
  message?: string;
}
