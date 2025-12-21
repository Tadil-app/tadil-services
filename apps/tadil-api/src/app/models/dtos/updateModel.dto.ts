import { ApiProperty } from '@nestjs/swagger';
import { ModelCategory } from '@tadil-models';
import { IsNotEmpty } from 'class-validator';

export class UpdateModelDTO {
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
  @ApiProperty()
  @IsNotEmpty()
  category!: ModelCategory;
}
