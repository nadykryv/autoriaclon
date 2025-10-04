export interface JwtPayload {
  sub: string;
  email: string;
  roles?: string[] | { name: string }[];
  permissions?: string[];
}