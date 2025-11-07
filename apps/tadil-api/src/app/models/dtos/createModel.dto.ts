import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateModelDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  file!: Express.Multer.File;
  @ApiProperty()
  @IsNotEmpty()
  englishName!: string;
  @ApiProperty()
  @IsNotEmpty()
  arabicName!: string;
  @ApiProperty()
  @IsNotEmpty()
  hindiName!: string;
  @ApiProperty()
  @IsNotEmpty()
  urduName!: string;
  @ApiProperty()
  @IsNotEmpty()
  bengaliName!: string;
}
