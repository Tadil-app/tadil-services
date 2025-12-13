import { ApiProperty } from '@nestjs/swagger';
import { DisplayModelImageDTO } from './displayModelImage.dto';

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
  @ApiProperty({ type: () => DisplayModelImageDTO, isArray: true })
  thumbNailImageBase64String?: string 
}
