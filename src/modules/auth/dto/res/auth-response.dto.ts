export class AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    accountType: 'base' | 'premium' | 'internal';
    roles: string[];
  };
}