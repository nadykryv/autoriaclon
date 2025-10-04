import { User } from '../../../database/entities/user.entity';
import { UserResponseDto } from '../dto/res/users.response.dto';

export class UserMapper {
  static toResDto(user: User): UserResponseDto {
    const safeAccountType: 'base' | 'premium' =
      user.accountType === 'internal' ? 'base' : user.accountType;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      avatarUrl: user.avatarUrl || null,
      accountType: safeAccountType,
      roles: user.roles?.map((role) => role.name) || [],
      name: user.firstName,
    };
  }
}