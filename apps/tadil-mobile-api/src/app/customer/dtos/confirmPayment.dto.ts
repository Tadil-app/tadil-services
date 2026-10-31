import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  paymentId!: string;

  /**
   * Optional: the payment carries the order id in its metadata, so a device
   * that lost its local state can still confirm the order it paid for.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderId?: string;
}

export class ConfirmPaymentResultDto {
  @ApiProperty()
  orderId!: string;

  @ApiProperty()
  reference!: string;
}

export class ReconcilePendingOrderResultDto {
  @ApiProperty({ enum: ['confirmed', 'abandoned', 'pending', 'missing'] })
  status!: 'confirmed' | 'abandoned' | 'pending' | 'missing';
}
