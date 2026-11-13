import { ApiProperty } from '@nestjs/swagger';
import { DisplayAddressDto } from '../../auth/dtos/displayAddress.dto';

/** A name stored in every app language. */
export class WaybillNamesDTO {
  @ApiProperty() englishName!: string;
  @ApiProperty() arabicName!: string;
  @ApiProperty() urduName!: string;
  @ApiProperty() hindiName!: string;
  @ApiProperty() bengaliName!: string;
}

export class WaybillInformationDTO extends WaybillNamesDTO {
  @ApiProperty() type!: string;
  @ApiProperty() value!: string;
  @ApiProperty({ required: false, nullable: true, type: String })
  unit?: string | null;
  /** The chosen option of a select menu, in every language. */
  @ApiProperty({ type: WaybillNamesDTO, required: false, nullable: true })
  extraDetails?: WaybillNamesDTO | null;
}

export class WaybillAlterationDTO extends WaybillNamesDTO {
  @ApiProperty({ type: WaybillInformationDTO, isArray: true })
  informations!: WaybillInformationDTO[];
}

export class WaybillPieceDTO {
  /** Null for a custom model, which has no catalog name. */
  @ApiProperty({ type: WaybillNamesDTO, required: false, nullable: true })
  names!: WaybillNamesDTO | null;

  @ApiProperty({ type: WaybillAlterationDTO, isArray: true })
  alterations!: WaybillAlterationDTO[];
}

export class WaybillPartyDTO {
  @ApiProperty() name!: string;
  @ApiProperty() phone!: string;
  @ApiProperty({ type: DisplayAddressDto, required: false, nullable: true })
  address!: DisplayAddressDto | null;
}

/** The order waybill printed and attached to the garment bag. */
export class WaybillDTO {
  @ApiProperty() orderId!: string;
  @ApiProperty() orderReference!: string;
  @ApiProperty() orderDate!: Date;
  @ApiProperty({ type: WaybillPartyDTO }) customer!: WaybillPartyDTO;
  @ApiProperty({ type: WaybillPartyDTO, required: false, nullable: true })
  tailor!: WaybillPartyDTO | null;
  @ApiProperty({ type: WaybillPieceDTO, isArray: true })
  pieces!: WaybillPieceDTO[];
}
