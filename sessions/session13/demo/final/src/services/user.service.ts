// Implements business logic for user operations.
// Processes requests from the controller and interacts with the repository as needed.

import logger from '../config/logger';
import { httpStatus } from '../config/httpStatusCodes';
import { UserRepository } from '../repositories/user.repository';
import { IUser, IUserCreate, IUserUpdate } from '../interfaces/user.interface';
import { AppError } from '../utils/application.error';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

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

  getAll = (pagination: { skip: number; limit: number }): IUser[] => {
    logger.debug(`Service: Fetching all users`);
    const filters = { includeBlocked: false }; // Filter logic
    return this.userRepository.getAll(filters, pagination);
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
    const existingUser = this.userRepository.getByEmail(data.email);
    if (existingUser) {
      logger.warn(`User with email ${data.email} already exists`);
      throw new AppError(
        'A user with this email already exists',
        httpStatus.CONFLICT,
        {
          email: data.email,
        }
      );
    }
    if (this.getAge(data.birthday) < 18) {
      logger.warn('User is under 18 years old', {
        birthday: data.birthday,
      });
      throw new AppError(
        'User must be at least 18 years old',
        httpStatus.BAD_REQUEST,
        { birthday: data.birthday }
      );
    }
    const createdUser = this.userRepository.create(data);
    if (!createdUser) {
      logger.warn('User creation failed');
      throw new AppError(
        'User creation failed',
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    logger.info(`User created successfully with email ${data.email}`);
    return createdUser;
  };

  update = (id: string, data: IUserUpdate): IUser => {
    const userToUpdate = this.userRepository.getById(id);
    if (!userToUpdate) {
      logger.warn(`User with id ${id} not found for update`);
      throw new AppError('User not found');
    }

    if (data.birthday && this.getAge(data.birthday) < 18) {
      logger.warn('User is under 18 years old', {
        birthday: data.birthday,
      });
      throw new AppError(
        'User must be at least 18 years old',
        httpStatus.CONFLICT,
        {
          email: data.email,
        }
      );
    }
    if (data.email) {
      const existingUser = this.userRepository.getByEmail(data.email);
      if (
        existingUser &&
        existingUser.id &&
        existingUser.id.toString() !== id
      ) {
        logger.warn(`Another user with email ${data.email} already exists`);
        throw new AppError(
          'A user with this email already exists',
          httpStatus.CONFLICT,
          {
            email: data.email,
          }
        );
      }
    }
    const updatedUser = this.userRepository.update(id, data);
    if (!updatedUser) {
      logger.warn(`User with id ${id} not found after update attempt`);
      throw new AppError('User not found', httpStatus.NOT_FOUND, { id });
    }
    logger.info(`User with id ${id} updated successfully`);
    return updatedUser;
  };
}
