import { ApiProperty } from '@nestjs/swagger';
import { DisplaySectionDTO } from '.';

export class DisplayModelDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  imageFileId!: string;
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
  @ApiProperty({ type: () => DisplaySectionDTO, isArray: true })
  sections!: DisplaySectionDTO[];
}
