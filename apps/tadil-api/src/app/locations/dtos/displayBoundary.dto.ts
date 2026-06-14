import { ApiProperty } from '@nestjs/swagger';

/** A GeoJSON geometry describing an administrative area's boundary. */
export class DisplayBoundaryDTO {
  @ApiProperty({ enum: ['Polygon', 'MultiPolygon'] })
  type!: 'Polygon' | 'MultiPolygon';

  @ApiProperty({
    type: 'array',
    items: {},
    description:
      'GeoJSON coordinates: rings of [lng, lat] (Polygon) or an array of such (MultiPolygon).',
  })
  coordinates!: number[][][] | number[][][][];
}
