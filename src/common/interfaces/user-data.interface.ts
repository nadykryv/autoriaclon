export interface Permission {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
  permissions?: Permission[];
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  accountType: 'base' | 'premium' | 'internal';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  permissions: string[];
  roles?: Role[];
}
export interface CurrentUserDto {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface IUserData {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

