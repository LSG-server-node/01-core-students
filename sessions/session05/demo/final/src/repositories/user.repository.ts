// Handles direct data operations related to users.
// This layer interacts with the database or a data source to perform CRUD operations.

import logger from '../config/logger';
import { IUser } from '../interfaces/user.interface';

const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'johndoe@test.com',
    password: 'hashedpassword',
    birthday: new Date('1990-01-01'),
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'janesmith@test.com',
    password: 'hashedpassword',
    birthday: new Date('1985-05-15'),
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export class UserRepository {
  create = (data: IUser): IUser | null => {
    logger.debug('Repository: Creating user with data', { data });
    const createdUser = users.push({
      id: (users.length + 1).toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    logger.debug('Repository: User created', {
      user: createdUser,
    });
    return createdUser as IUser;
  };

  getByEmail = (email: string): IUser | null => {
    logger.debug(`Repository: Fetching user by email: ${email}`);
    const userFound = users.find((user) => user.email === email);
    if (!userFound) {
      logger.debug(`Repository: No user found with email: ${email}`);
      return null;
    }
    logger.debug(
      `Repository: User with email ${email} fetched and transformed`
    );
    return userFound;
  };
}
