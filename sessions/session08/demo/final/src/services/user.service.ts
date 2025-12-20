// Implements business logic for user operations.
// Processes requests from the controller and interacts with the repository as needed.

import logger from '../config/logger';
import { httpStatus } from '../config/httpStatusCodes';
import { UserRepository } from '../repositories/user.repository';
import { IUser, IUserCreate } from '../interfaces/user.interface';

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
    const existingUser = this.userRepository.getByEmail(data.email);
    if (existingUser) {
      logger.warn(`User with email ${data.email} already exists`);
      throw new Error(
        'A user with this email already exists' + httpStatus.CONFLICT
      );
    }
    if (this.getAge(data.birthday) < 18) {
      logger.warn('User is under 18 years old', {
        birthday: data.birthday,
      });
      throw new Error(
        'User must be at least 18 years old' + httpStatus.BAD_REQUEST
      );
    }
    const createdUser = this.userRepository.create(data);
    if (!createdUser) {
      logger.warn('User creation failed');
      throw new Error('User creation failed');
    }
    logger.info(`User created successfully with email ${data.email}`);
    return createdUser;
  };
}
