import { ApiProperty } from '@nestjs/swagger';

export class AddModelImageDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  imageFile!: Express.Multer.File;
}
