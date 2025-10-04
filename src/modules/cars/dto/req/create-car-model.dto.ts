import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarModelDto {
  @ApiProperty({ example: 'X5', description: 'Car model name' })
  @IsString()
  @IsNotEmpty({ message: 'Model name is required' })
  name: string;
}