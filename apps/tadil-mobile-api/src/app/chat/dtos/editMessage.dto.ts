import { ApiProperty } from '@nestjs/swagger';
import { MessageChannel } from '@prisma/client';

export class EditMessageDto {
  @ApiProperty()
  orderId!: string;

  @ApiProperty({ enum: MessageChannel })
  channel!: MessageChannel;

  @ApiProperty()
  messageId!: string;

  @ApiProperty()
  newContent!: string;
}
