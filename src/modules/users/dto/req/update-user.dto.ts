import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsEnum, IsUrl, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsEnum(['base', 'premium'], { message: 'Invalid account' })
  accountType?: 'base' | 'premium';

  @IsOptional()
  @IsString()
  hashedRefreshToken?: string | null;
}