import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  avatarUrl?: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false })
  accountType?: 'base' | 'premium' | 'internal';

  @ApiProperty({ type: [String], required: false })
  roles?: string[];

  @ApiProperty({ required: false })
  fullName?: string;
}
