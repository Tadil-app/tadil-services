import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddModelImageDTO {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    }
  })
  @IsNotEmpty()
  files!: Express.Multer.File[];
}
