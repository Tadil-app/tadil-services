import { ApiProperty } from '@nestjs/swagger';

export class DisplayExtraDTO {
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
}

export enum InformationType {
  TEXT = 'text',
  NUMBER = 'number',
  SELECT_MENU = 'select_menu',
  CHECKBOX = 'checkbox',
}

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
  @ApiProperty()
  isRequired!: boolean;
  @ApiProperty({ enum: InformationType, enumName: 'InformationType' })
  type!: InformationType;
  @ApiProperty({ type: DisplayExtraDTO, isArray: true })
  extras!: DisplayExtraDTO[];
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
