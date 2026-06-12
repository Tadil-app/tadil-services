import { ApiProperty } from '@nestjs/swagger';

export class OrderStatusHistoryDto {
  @ApiProperty()
  status!: string;

  @ApiProperty()
  timestamp!: string;
}

export class DisplayOrderDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  reference!: string;

  @ApiProperty()
  date!: string;

  @ApiProperty()
  totalPrice!: number;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  customerId!: string;

  @ApiProperty({ required: false })
  assignedTailorId?: string;

  @ApiProperty({ required: false })
  assignedCourierId?: string;

  @ApiProperty({ required: false })
  assignedReturnCourierId?: string;

  @ApiProperty({ required: false })
  customerName?: string;

  @ApiProperty({ required: false })
  tailorName?: string;

  @ApiProperty({ required: false })
  courierName?: string;
  
  @ApiProperty({ required: false })
  cityNameAr?: string;

  @ApiProperty({ required: false })
  cityNameEn?: string;

  @ApiProperty({ required: false })
  cityNameBn?: string;

  @ApiProperty({ required: false })
  cityNameHi?: string;

  @ApiProperty({ required: false })
  cityNameUr?: string;

  @ApiProperty({ required: false })
  districtNameAr?: string;

  @ApiProperty({ required: false })
  districtNameEn?: string;

  @ApiProperty({ required: false })
  districtNameBn?: string;

  @ApiProperty({ required: false })
  districtNameHi?: string;

  @ApiProperty({ required: false })
  districtNameUr?: string;

  @ApiProperty({ type: OrderStatusHistoryDto, isArray: true, required: false })
  history?: OrderStatusHistoryDto[];
}
