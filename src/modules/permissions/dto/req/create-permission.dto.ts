import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ example: 'users:create', description: 'Permit Name' })
  @IsString()
  @IsNotEmpty({ message: 'Permit name is required' })
  name: string;

  @ApiProperty({
    example: 'Permission to create users',
    description: 'Permit Description',
  })
  @IsString()
  @IsNotEmpty({ message: 'Permit description is mandatory' })
  description: string;
}