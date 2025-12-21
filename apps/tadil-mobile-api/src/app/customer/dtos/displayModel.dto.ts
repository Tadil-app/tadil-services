import { ApiProperty } from '@nestjs/swagger';
import { ModelCategory } from '@tadil-models';

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
  @ApiProperty()
  category!: ModelCategory;
  @ApiProperty()
  thumbnailImageUrl?: string;
}
