// Defines pure transformation functions for mapping between User domain types and DTOs.
// To adapt data across architectural layers.

import { IUser, IUserCreate } from '../interfaces/user.interface';
import { UserResponseDto, CreateUserDto } from '../dtos/user.dto';

export const toUserResponse = (u: IUser): UserResponseDto => ({
  id: u.id,
  name: u.name,
  email: u.email,
  birthday: u.birthday.toISOString(),
  isBlocked: u.isBlocked,
  createdAt: u.createdAt.toISOString(),
  updatedAt: u.updatedAt.toISOString(),
});

export const toCreateUserInput = (dto: CreateUserDto): IUserCreate => ({
  name: dto.name,
  email: dto.email,
  password: dto.password,
  birthday: new Date(dto.birthday),
  isBlocked: false,
});
