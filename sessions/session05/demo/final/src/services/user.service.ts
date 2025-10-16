// Implements business logic for user operations.
// Processes requests from the controller and interacts with the repository as needed.

import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../interfaces/user.interface';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private readonly normalizeUserData = (data: IUser): IUser => {
    const normalizedData = { ...data };
    if (data.name && typeof data.name === 'string') {
      normalizedData.name = data.name.trim();
    }
    if (data.email && typeof data.email === 'string') {
      normalizedData.email = data.email.toLowerCase().trim();
    }
    if (data.password && typeof data.password === 'string') {
      normalizedData.password = data.password.trim();
    }
    if (data.birthday && typeof data.birthday === 'string') {
      normalizedData.birthday = new Date(data.birthday);
    }
    if (data.isBlocked && typeof data.isBlocked === 'string') {
      normalizedData.isBlocked = data.isBlocked === 'true';
    }
    logger.debug({ normalizedData }, 'Normalized user data');
    return normalizedData;
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

  create = (data: IUser): IUser => {
    const normalizedData = this.normalizeUserData(data);
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
      throw new Error(
        'User creation failed' + httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    logger.info(`User created successfully with email ${normalizedData.email}`);
    return createdUser;
  };
}
