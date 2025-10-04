import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<T> {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 5 })
  pages: number;

  @ApiProperty({ example: 50 })
  countItems: number;

  @ApiProperty({ isArray: true })
  entities: T[];
}