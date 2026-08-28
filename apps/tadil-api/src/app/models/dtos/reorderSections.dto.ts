import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ReorderSectionsDTO {
  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  sectionIds!: string[];
}
