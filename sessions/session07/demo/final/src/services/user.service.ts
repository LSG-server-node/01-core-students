// Implements business logic for user operations.
// Processes requests from the controller and interacts with the repository as needed.

import logger from '../config/logger';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../interfaces/user.interface';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

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
}
