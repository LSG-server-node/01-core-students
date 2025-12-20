// Contains the core User interface and all related domain types.
// Ensures consistent and type-safe handling of user data across the application.

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  birthday: Date;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type SystemKeys = 'id' | 'createdAt' | 'updatedAt';

export type IUserCreate = Omit<IUser, SystemKeys>;

export type IUserUpdate = Partial<Omit<IUser, SystemKeys>>;
