import { ApiProperty } from '@nestjs/swagger';

export enum ModelCategory {
  ALL = 'all',
  MEN = 'men',
  WOMEN = 'women',
  KIDS = 'kids',
}
export class DisplayModelDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  englishName!: string;
  @ApiProperty()
  arabicName!: string;
  @ApiProperty()
  hindiName!: string;
  @ApiProperty()
  urduName!: string;
  @ApiProperty()
  bengaliName!: string;
  @ApiProperty({ enum: ModelCategory, enumName: 'ModelCategory' })
  category!: ModelCategory;
  @ApiProperty({ required: false })
  thumbnailImageUrl?: string;
}
