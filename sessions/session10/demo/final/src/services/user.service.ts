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
  IUserUpdate,
} from '../interfaces/user.interface';
import { AppError } from '../utils/application.error';

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

  getById = (id: string): IUser => {
    logger.debug(`Service: Fetching user by ID: ${id}`);
    const user = this.userRepository.getById(id);
    if (!user) {
      logger.warn(`User with id ${id} not found`);
      throw new AppError('User not found', httpStatus.NOT_FOUND, { id });
    }
    return user;
  };

  delete = (id: string): IUser => {
    logger.debug(`Service: Deleting user with ID: ${id}`);
    const userDeleted = this.userRepository.delete(id);
    if (!userDeleted) {
      logger.warn(`User with id ${id} not found for deletion`);
      throw new AppError('User not found', httpStatus.NOT_FOUND);
    }
    logger.info(`User with id ${id} deleted successfully`);
    return userDeleted;
  };

  create = (data: IUserCreate): IUser => {
    const normalizedData = this.normalizeUserData(data) as IUserCreate;
    const existingUser = this.userRepository.getByEmail(normalizedData.email);
    if (existingUser) {
      logger.warn(`User with email ${normalizedData.email} already exists`);
      throw new AppError(
        'A user with this email already exists',
        httpStatus.CONFLICT,
        {
          email: normalizedData.email,
        }
      );
    }
    if (this.getAge(normalizedData.birthday) < 18) {
      logger.warn('User is under 18 years old', {
        birthday: normalizedData.birthday,
      });
      throw new AppError(
        'User must be at least 18 years old',
        httpStatus.BAD_REQUEST,
        { birthday: normalizedData.birthday }
      );
    }
    const createdUser = this.userRepository.create(normalizedData);
    if (!createdUser) {
      logger.warn('User creation failed');
      throw new AppError(
        'User creation failed',
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    logger.info(`User created successfully with email ${normalizedData.email}`);
    return createdUser;
  };

  update = async (id: string, data: IUserUpdate): Promise<IUser> => {
    const userToUpdate = this.userRepository.getById(id);
    if (!userToUpdate) {
      logger.warn(`User with id ${id} not found for update`);
      throw new Error('User not found');
    }

    const normalizedData = this.normalizeUserData(data) as IUserUpdate;
    if (normalizedData.birthday && this.getAge(normalizedData.birthday) < 18) {
      logger.warn('User is under 18 years old', {
        birthday: normalizedData.birthday,
      });
      throw new AppError(
        'A user with this email already exists',
        httpStatus.CONFLICT,
        {
          email: normalizedData.email,
        }
      );
    }
    if (normalizedData.email) {
      const existingUser = this.userRepository.getByEmail(normalizedData.email);
      if (
        existingUser &&
        existingUser.id &&
        existingUser.id.toString() !== id
      ) {
        logger.warn(
          `Another user with email ${normalizedData.email} already exists`
        );
        throw new AppError(
          'A user with this email already exists',
          httpStatus.CONFLICT,
          {
            email: normalizedData.email,
          }
        );
      }
    }
    const updatedUser = this.userRepository.update(id, normalizedData);
    if (!updatedUser) {
      logger.warn(`User with id ${id} not found after update attempt`);
      throw new AppError('User not found', httpStatus.NOT_FOUND, { id });
    }
    logger.info(`User with id ${id} updated successfully`);
    return updatedUser;
  };
}
