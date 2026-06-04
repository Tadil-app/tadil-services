import { ApiProperty } from '@nestjs/swagger';
import { InformationType } from '@prisma/client';
import { DisplayOrderDto } from './displayOrder.dto';

export class OrderPointDto {
  @ApiProperty()
  x!: number;
  @ApiProperty()
  y!: number;
}

export class DisplayExtraSnapshotDTO {
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
  @ApiProperty({ required: false })
  unit?: string;
  @ApiProperty()
  value!: string;
  @ApiProperty({ type: DisplayExtraSnapshotDTO, required: false })
  extraDetails?: DisplayExtraSnapshotDTO;
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
  @ApiProperty({ type: OrderPointDto, isArray: true })
  customCoordinates!: OrderPointDto[];
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
  @ApiProperty({ type: OrderPointDto, isArray: true })
  coordinates!: OrderPointDto[];
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

export class ChatMessageDto {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  senderId!: string;
  @ApiProperty()
  type!: string;
  @ApiProperty()
  content!: string;
  @ApiProperty()
  timestamp!: string;
  @ApiProperty({ required: false })
  metadata?: any;
  @ApiProperty({ required: false })
  deletedAt?: string;
  @ApiProperty({ required: false })
  isEdited?: boolean;
}

export class ChatDto {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  channel!: string;
  @ApiProperty({ type: ChatMessageDto, isArray: true })
  messages!: ChatMessageDto[];
  @ApiProperty()
  updatedAt!: string;
}

export class DisplayOrderDetailsDto extends DisplayOrderDto {
  @ApiProperty({ type: DisplayOrderItemDTO, isArray: true })
  items!: DisplayOrderItemDTO[];

  @ApiProperty({ type: DisplayCustomOrderItemDTO, isArray: true })
  customItems!: DisplayCustomOrderItemDTO[];

  @ApiProperty({ type: ChatDto, isArray: true })
  chats!: ChatDto[];
}
