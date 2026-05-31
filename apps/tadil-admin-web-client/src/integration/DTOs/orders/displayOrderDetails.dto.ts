import type { DisplayOrderDTO } from './displayOrder.dto';

export interface OrderPointDto {
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
  type: string;
  unit?: string;
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
  customCoordinates: OrderPointDto[];
  informations: DisplayItemInformationDTO[];
}

export interface DisplayOrderItemSectionDTO {
  id: string;
  englishName: string;
  arabicName: string;
  urduName: string;
  hindiName: string;
  bengaliName: string;
  coordinates: OrderPointDto[];
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

export interface ChatMessageDto {
  id: string;
  senderId: string;
  type: string;
  content: string;
  timestamp: string;
  metadata?: any;
  deletedAt?: string;
  isEdited?: boolean;
}

export interface ChatDto {
  id: string;
  channel: string;
  messages: ChatMessageDto[];
  updatedAt: string;
}

export interface DisplayOrderDetailsDto extends DisplayOrderDTO {
  items: DisplayOrderItemDTO[];
  customItems: DisplayCustomOrderItemDTO[];
  chats: ChatDto[];
}
