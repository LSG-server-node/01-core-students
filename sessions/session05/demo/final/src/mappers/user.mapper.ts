// Defines pure transformation functions for mapping between User domain types and DTOs.
// To adapt data across architectural layers.

import { IUser } from '../interfaces/user.interface';
import { UserResponseDto } from '../dtos/user.dto';

export const toUserResponse = (u: IUser): UserResponseDto => ({
  id: u.id,
  name: u.name,
  email: u.email,
  birthday: u.birthday.toISOString(),
  isBlocked: u.isBlocked,
  createdAt: u.createdAt.toISOString(),
  updatedAt: u.updatedAt.toISOString(),
});
