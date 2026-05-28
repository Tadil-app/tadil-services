import { ApiProperty } from '@nestjs/swagger';
import { MessageChannel } from '@prisma/client';

export class DeleteMessageDto {
  @ApiProperty()
  orderId!: string;

  @ApiProperty({ enum: MessageChannel })
  channel!: MessageChannel;

  @ApiProperty()
  messageId!: string;
}
