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
}
