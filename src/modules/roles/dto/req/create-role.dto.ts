import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'Role Name' })
  @IsString()
  @IsNotEmpty({ message: 'Role name is required' })
  name: string;

  @ApiProperty({
    example: 'System Administrator',
    description: 'Role Description',
  })
  @IsString()
  @IsNotEmpty({ message: 'Role description is mandatory' })
  description: string;
}