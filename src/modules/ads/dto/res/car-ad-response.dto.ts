import { ApiProperty } from '@nestjs/swagger';

export class CarAdResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  views: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => Object, nullable: true })
  model?: { id: string; name: string; brand: { id: string; name: string } };

  @ApiProperty({ type: () => Object, nullable: true })
  seller?: { id: string; email: string };
}
