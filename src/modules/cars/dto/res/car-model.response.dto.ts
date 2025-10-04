import { ApiProperty } from '@nestjs/swagger';

export class CarModelResponseDto {
  @ApiProperty() id: string;

  @ApiProperty() name: string;

  @ApiProperty({ type: () => Object, nullable: true })
  brand?: { id: string; name: string };
}