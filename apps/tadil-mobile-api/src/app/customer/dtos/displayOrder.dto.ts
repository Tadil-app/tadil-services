import { ApiProperty } from '@nestjs/swagger';
import { type OrderStatusType } from '@tadil-common';
import { InformationType } from '@tadil-informations';

export class OrderPoint {
  @ApiProperty()
  x!: number;
  @ApiProperty()
  y!: number;
}

export class DisplayItemInformationDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  englishName!: string;
  @ApiProperty()
  arabicName!: string;
  @ApiProperty()
  urduName!: string;
  @ApiProperty()
  hindiName!: string;
  @ApiProperty()
  bengaliName!: string;
  @ApiProperty()
  type!: InformationType;
  @ApiProperty()
  unit?: string;
  @ApiProperty()
  value!: string;
}

export class DisplayItemAlterationDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  englishName!: string;
  @ApiProperty()
  arabicName!: string;
  @ApiProperty()
  urduName!: string;
  @ApiProperty()
  hindiName!: string;
  @ApiProperty()
  bengaliName!: string;
  @ApiProperty()
  price!: number;
  @ApiProperty({ type: OrderPoint, isArray: true })
  customCoordinates!: OrderPoint[];
  @ApiProperty({ type: DisplayItemInformationDTO, isArray: true })
  informations!: DisplayItemInformationDTO[];
}

export class DisplayOrderItemSectionDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  englishName!: string;
  @ApiProperty()
  arabicName!: string;
  @ApiProperty()
  urduName!: string;
  @ApiProperty()
  hindiName!: string;
  @ApiProperty()
  bengaliName!: string;
  @ApiProperty()
  coordinates!: OrderPoint[];
  @ApiProperty({ type: DisplayItemAlterationDTO, isArray: true })
  alterations!: DisplayItemAlterationDTO[];
}

export class DisplayOrderItemDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  englishName!: string;
  @ApiProperty()
  arabicName!: string;
  @ApiProperty()
  urduName!: string;
  @ApiProperty()
  hindiName!: string;
  @ApiProperty()
  bengaliName!: string;
  @ApiProperty()
  imageFileUrl!: string;
  @ApiProperty()
  price!: number;
  @ApiProperty({ type: DisplayOrderItemSectionDTO, isArray: true })
  sections!: DisplayOrderItemSectionDTO[];
}

export class DisplayCustomOrderItemDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  price!: number;
  @ApiProperty()
  imageFileUrl!: string;
  @ApiProperty({ type: DisplayItemAlterationDTO, isArray: true })
  alterations!: DisplayItemAlterationDTO[];
}

export class OrderStatusHistoryDTO {
  @ApiProperty()
  status!: OrderStatusType;
  @ApiProperty()
  timestamp!: Date;
}

export class DisplayOrderDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  customerId!: string;
  @ApiProperty()
  reference!: string;
  @ApiProperty()
  date!: Date;
  @ApiProperty()
  totalPrice!: number;
  @ApiProperty()
  status!: OrderStatusType;
  @ApiProperty({ type: DisplayOrderItemDTO, isArray: true })
  items!: DisplayOrderItemDTO[];
  @ApiProperty({ type: DisplayCustomOrderItemDTO, isArray: true })
  customItems!: DisplayCustomOrderItemDTO[];
  @ApiProperty({ type: OrderStatusHistoryDTO, isArray: true })
  history!: OrderStatusHistoryDTO[];
}
