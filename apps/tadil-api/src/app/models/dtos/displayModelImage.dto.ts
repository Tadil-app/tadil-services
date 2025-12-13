import { ApiProperty } from '@nestjs/swagger';
import { DisplaySectionDTO } from './displaySection.dto';

export class DisplayModelImageDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  fileId!: string;
  @ApiProperty()
  imageBase64String!: string;
  @ApiProperty({ type: () => DisplaySectionDTO, isArray: true })
  sections!: DisplaySectionDTO[];
}
