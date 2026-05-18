import { ApiProperty } from '@nestjs/swagger';
import { MessageChannel } from '@prisma/client';

export class SendMessageDto {
  @ApiProperty()
  orderId!: string;

  @ApiProperty({ enum: MessageChannel })
  channel!: MessageChannel;

  @ApiProperty({ enum: ['TEXT', 'IMAGE', 'AUDIO'] })
  type!: 'TEXT' | 'IMAGE' | 'AUDIO';

  @ApiProperty()
  content!: string;

  @ApiProperty({ required: false })
  metadata?: any;
}
