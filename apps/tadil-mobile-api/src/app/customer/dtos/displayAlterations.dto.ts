import { ApiProperty } from '@nestjs/swagger';

export class DisplayInformationDTO {
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
  @ApiProperty({ required: false })
  unit?: string;
}

export class DisplayAlterationDTO {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  englishName!: string;
  @ApiProperty()
  arabicName!: string;
  @ApiProperty()
  urduName!: string;
  @ApiProperty()
  hindiName!: string;
  @ApiProperty()
  bengaliName!: string;
  @ApiProperty()
  price!: number;
  @ApiProperty({ type: DisplayInformationDTO, isArray: true })
  informations!: DisplayInformationDTO[];
}
