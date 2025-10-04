import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsString, IsIn } from 'class-validator';

export class BaseQueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['id', 'email', 'name', 'createdAt'],
    default: 'id',
  })
  @IsOptional()
  @IsString()
  @IsIn(['id', 'email', 'name', 'createdAt'])
  sort?: string = 'id';

  @ApiPropertyOptional({
    description: 'Sorting order',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  order?: string = 'ASC';

  @ApiPropertyOptional({ description: 'Search text (email or name)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by role (es. admin, manager, buyer, seller)',
  })
  @IsOptional()
  @IsString()
  role?: string;
}
