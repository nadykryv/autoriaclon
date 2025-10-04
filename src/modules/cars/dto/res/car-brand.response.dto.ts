import { ApiProperty } from '@nestjs/swagger';

export class CarBrandResponseDto {
  @ApiProperty() id: string;

  @ApiProperty() name: string;

  @ApiProperty({ isArray: true, type: () => Object })
  models?: { id: string; name: string }[];
}