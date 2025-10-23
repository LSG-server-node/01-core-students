// Manages HTTP requests related to users.
// Contains methods for handling routes like GET, POST, PUT, DELETE for users.
// Delegates business logic to the user service.

import { type Request, type Response } from 'express';
import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { UserService } from '../services/user.service';
import { toUserResponse } from '../mappers/user.mapper';

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAll = (req: Request, res: Response): void => {
    logger.debug(`Controller: Received getAll request`);
    try {
      const users = this.userService.getAll();
      const data = users.map(toUserResponse); // <- NOT exposing sensitive data

      const response = {
        message: 'Users fetched successfully',
        length: data.length,
        data,
      };
      res.send(response);
    } catch (error) {
      logger.debug('Controller: Error fetching users');
      res.status(httpStatus.BAD_REQUEST).send({ error });
    }
  };

  getById = (req: Request, res: Response): void => {
    const userId = req.params.id;
    logger.debug(`Controller: Received getById request for user id: ${userId}`);
    try {
      if (!userId || isNaN(Number(userId))) {
        throw new Error('Invalid user id');
      }
      const user = this.userService.getById(userId);
      if (!user) {
        res.status(httpStatus.NOT_FOUND).send({ error: 'User not found' });
        return;
      }
      const data = toUserResponse(user);

      const response = {
        message: 'User fetched successfully',
        data,
      };
      res.send(response);
    } catch (error) {
      logger.debug(
        { id: userId, error },
        'Controller: Error fetching user by id'
      );
      res.status(httpStatus.BAD_REQUEST).send({ error });
    }
  };
}
