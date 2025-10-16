// Handles direct data operations related to users.
// This layer interacts with the database or a data source to perform CRUD operations.

import logger from '../config/logger';
import { IUser } from '../interfaces/user.interface';

const usersDB = [
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
  getAll = (filters: { includeBlocked?: boolean }): IUser[] => {
    logger.debug(`Repository: Finding users`);
    const users = usersDB.filter((user) =>
      filters.includeBlocked ? true : !user.isBlocked
    );
    logger.debug(`Repository: Found ${users.length} users`);
    return users;
  };
}
