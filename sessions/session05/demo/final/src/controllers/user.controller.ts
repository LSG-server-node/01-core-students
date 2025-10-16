// Manages HTTP requests related to users.
// Contains methods for handling routes like GET, POST, PUT, DELETE for users.
// Delegates business logic to the user service.

import { NextFunction, type Request, type Response } from 'express';
import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { UserService } from '../services/user.service';

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  create = (req: Request, res: Response): void => {
    logger.debug('Controller: Received request to create a new user', {
      body: req.body,
    });
    try {
      const body = req.body;
      if (!body) {
        throw new Error('Request body is missing' + httpStatus.BAD_REQUEST);
      }
      if (!body.name || !body.email || !body.password || !body.birthday) {
        throw new Error(
          'Missing required fields: name, email, password, birthday' +
            httpStatus.BAD_REQUEST
        );
      }
      const user = this.userService.create();
      const response = {
        message: 'User created successfully',
        data: user,
      };
      res.status(httpStatus.CREATED).send(response);
    } catch (error: unknown) {
      logger.debug({ body: req.body }, 'Controller: Error creating user');
      res.status(httpStatus.BAD_REQUEST).send({ error });
    }
  };
}
