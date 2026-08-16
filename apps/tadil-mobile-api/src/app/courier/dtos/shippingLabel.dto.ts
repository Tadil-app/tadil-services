import { ApiProperty } from '@nestjs/swagger';

export class ShippingLabelItemDTO {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  details!: string;

  @ApiProperty()
  price!: number;
}

export class ShippingLabelDTO {
  @ApiProperty()
  orderId!: string;

  @ApiProperty()
  orderReference!: string;

  @ApiProperty()
  orderDate!: Date;

  @ApiProperty()
  totalPrice!: number;

  @ApiProperty()
  customerName!: string;

  @ApiProperty()
  customerPhone!: string;

  @ApiProperty()
  customerAddress!: string;

  @ApiProperty({ required: false })
  tailorName?: string;

  @ApiProperty({ required: false })
  tailorPhone?: string;

  @ApiProperty({ required: false })
  tailorAddress?: string;

  @ApiProperty({ type: ShippingLabelItemDTO, isArray: true })
  items!: ShippingLabelItemDTO[];
}
