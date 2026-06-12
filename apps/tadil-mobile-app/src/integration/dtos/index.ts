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
  WAITING_FOR_TAILOR_ASSIGNMENT: "waitingForTailorAssignement",
  WAITING_FOR_COURIER_ASSIGNMENT: "waitingForCourierAssignement",
  WAITING_FOR_PICKUP_FROM_CUSTOMER: "waitingForPickupFromCustomer",
  WAITING_FOR_DROPOFF_TO_TAILOR: "waitingForDropoffToTailor",
  IN_PROGRESS: "inProgress",
  WAITING_FOR_RETURN_COURIER_ASSIGNMENT: "waitingForReturnCourierAssignement",
  WAITING_FOR_PICKUP_FROM_TAILOR: "waitingForPickupFromTailor",
  WAITING_FOR_DROPOFF_TO_CUSTOMER: "waitingForDropoffToCustomer",
  DONE: "done",
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
  extraDetails?: DisplayExtraDTO;
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
  extraDetails?: DisplayExtraDTO;
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

export interface OrderStatusHistoryDTO {
  status: OrderStatusType;
  timestamp: string;
}

export interface DisplayOrderDTO {
  id: string;
  customerId: string;
  reference: string;
  date: string;
  totalPrice: number;
  status: OrderStatusType;
  assignedTailorId?: string;
  assignedCourierId?: string;
  assignedReturnCourierId?: string;
  items: DisplayOrderItemDTO[];
  customItems: DisplayCustomOrderItemDTO[];
  address?: DisplayAddressDto;
  history: OrderStatusHistoryDTO[];
}

export interface CreateOrderDto {
  addressId: string;
  items: any[];
  customItems: any[];
}

export interface ConfirmPaymentDto {
  paymentId: string;
}

export interface RequestPayoutDto {
  amount: number;
}

export interface LoginDto {
  phone: string;
}

export interface CompleteProfileDto {
  phone: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface CreateAddressDto {
  city: string;
  street?: string;
  district?: string;
}

export interface UpdateAddressDto {
  city?: string;
  street?: string;
  district?: string;
}

export interface DisplayAddressDto {
  id: string;
  city: string;
  street?: string;
  district?: string;
  userId: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "tailor" | "customer" | "courier";
  email?: string;
  addresses?: DisplayAddressDto[];
}

export interface AuthResponseDto {
  status: "authenticated" | "signup_required" | "pending" | "rejected";
  token?: string;
  user?: User;
  message?: string;
}
