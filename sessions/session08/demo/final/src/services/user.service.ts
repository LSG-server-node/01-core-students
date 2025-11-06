// Implements business logic for user operations.
// Processes requests from the controller and interacts with the repository as needed.

import logger from '../config/logger';
import { httpStatus } from '../config/httpStatusCodes';
import { UserRepository } from '../repositories/user.repository';
import {
  IUser,
  NormalizableUser,
  EditableUser,
  IUserCreate,
} from '../interfaces/user.interface';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private readonly normalizeUserData = (
    data: NormalizableUser
  ): Partial<EditableUser> => {
    const out: Partial<EditableUser> = {};

    if (typeof data.name === 'string') out.name = data.name.trim();
    if (typeof data.email === 'string')
      out.email = data.email.toLowerCase().trim();
    if (typeof data.password === 'string') out.password = data.password.trim();

    if (
      data.birthday instanceof Date &&
      !Number.isNaN(data.birthday.getTime())
    ) {
      out.birthday = data.birthday;
    } else if (typeof data.birthday === 'string') {
      const d = new Date(data.birthday);
      if (!Number.isNaN(d.getTime())) out.birthday = d;
    }

    if (typeof data.isBlocked === 'boolean') {
      out.isBlocked = data.isBlocked;
    } else if (typeof data.isBlocked === 'number') {
      out.isBlocked = data.isBlocked !== 0;
    } else if (typeof data.isBlocked === 'string') {
      const s = data.isBlocked.trim().toLowerCase();
      if (['true', '1', 'yes', 'y', 'sí', 'si'].includes(s))
        out.isBlocked = true;
      if (['false', '0', 'no', 'n'].includes(s)) out.isBlocked = false;
    }

    logger.debug({ normalizedData: out }, 'Normalized user data');
    return out;
  };

  private readonly getAge = (birthday: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthday.getDate())
    ) {
      age--;
    }
    logger.debug({ birthday, age }, 'Calculated age');
    return age;
  };

  getAll = (): IUser[] => {
    logger.debug(`Service: Fetching all users`);
    const filters = { includeBlocked: false }; // Filter logic
    return this.userRepository.getAll(filters);
  };

  getById = (id: string): IUser | null => {
    logger.debug(`Service: Fetching user by ID: ${id}`);
    return this.userRepository.getById(id);
  };

  delete = (id: string): IUser | null => {
    logger.debug(`Service: Deleting user with ID: ${id}`);
    return this.userRepository.delete(id);
  };

  create = (data: IUserCreate): IUser => {
    logger.debug({ data }, 'Service: Creating user');
    const normalizedData = this.normalizeUserData(data) as IUserCreate;
    const existingUser = this.userRepository.getByEmail(normalizedData.email);
    if (existingUser) {
      logger.warn(`User with email ${normalizedData.email} already exists`);
      throw new Error(
        'A user with this email already exists' + httpStatus.CONFLICT
      );
    }
    if (this.getAge(normalizedData.birthday) < 18) {
      logger.warn('User is under 18 years old', {
        birthday: normalizedData.birthday,
      });
      throw new Error(
        'User must be at least 18 years old' + httpStatus.BAD_REQUEST
      );
    }
    const createdUser = this.userRepository.create(normalizedData);
    if (!createdUser) {
      logger.warn('User creation failed');
      throw new Error('User creation failed');
    }
    logger.info(`User created successfully with email ${normalizedData.email}`);
    return createdUser;
  };
}
