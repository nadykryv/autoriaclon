export interface RequestUser {
  id: number;
  email: string;
  roles: string[];
  permissions?: string[];
  accountType?: string;
  firstName?: string;
  lastName?: string;
}