import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarBrandDto {
  @ApiProperty({ example: 'BMW', description: 'Car brand name' })
  @IsString()
  @IsNotEmpty({ message: 'Brand name is required' })
  name: string;
}