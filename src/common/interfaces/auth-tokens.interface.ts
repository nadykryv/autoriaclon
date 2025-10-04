import { UserResponseDto } from '../../modules/users/dto/res/users.response.dto';

export interface AuthTokenPair {
  access_token: string;
  refresh_token: string;
  user?: UserResponseDto;
}