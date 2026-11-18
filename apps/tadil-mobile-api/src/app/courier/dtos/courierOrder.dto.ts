import { ApiProperty } from '@nestjs/swagger';
import { DisplayOrderDTO } from '../../tailor/dtos/order';
import { DisplayAddressDto } from '../../auth/dtos/displayAddress.dto';

/**
 * An order as a courier sees it: both ends of the trip, so the app can show
 * the pickup and drop-off points and open navigation to either one.
 */
export class CourierOrderDTO extends DisplayOrderDTO {
  @ApiProperty({ type: DisplayAddressDto, required: false, nullable: true })
  address?: DisplayAddressDto | null;

  @ApiProperty({ required: false, nullable: true, type: String })
  tailorName?: string | null;

  @ApiProperty({ type: DisplayAddressDto, required: false, nullable: true })
  tailorAddress?: DisplayAddressDto | null;
}
