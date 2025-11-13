// Manages HTTP requests related to users.
// Contains methods for handling routes like GET, POST, PUT, DELETE for users.
// Delegates business logic to the user service.

import { type Request, type Response } from 'express';
import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { UserService } from '../services/user.service';
import {
  toUserResponse,
  toCreateUserInput,
  toUpdateUserInput,
} from '../mappers/user.mapper';

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

  delete = (req: Request, res: Response): void => {
    const userId = req.params.id;
    logger.debug(`Controller: Received request to delete user id: ${userId}`);
    try {
      if (!userId || isNaN(Number(userId))) {
        throw new Error('Invalid user id');
      }
      const user = this.userService.delete(userId);
      if (!user) {
        res.status(httpStatus.NOT_FOUND).send({ error: 'User not found' });
        return;
      }
      const data = toUserResponse(user);

      const response = {
        message: 'User deleted successfully',
        data: data,
      };
      res.send(response);
    } catch (error) {
      logger.debug({ id: userId, error }, 'Controller: Error deleting user');
      res.status(httpStatus.BAD_REQUEST).send({ error });
    }
  };

  create = (req: Request, res: Response): void => {
    const body = req.body;
    logger.debug('Controller: Received request to create a new user', {
      body: req.body,
    });
    try {
      if (!body) {
        throw new Error('Request body is missing');
      }
      if (!body.name || !body.email || !body.password || !body.birthday) {
        throw new Error(
          'Missing required fields: name, email, password, birthday'
        );
      }
      const userToCreate = toCreateUserInput(body);
      const user = this.userService.create(userToCreate);
      const data = toUserResponse(user);

      const response = {
        message: 'User created successfully',
        data,
      };
      res.status(httpStatus.CREATED).send(response);
    } catch (error) {
      logger.debug({ body }, 'Controller: Error creating user');
      res.status(httpStatus.BAD_REQUEST).send({ error });
    }
  };

  update = async (req: Request, res: Response): void => {
    const userId = req.params.id;
    const body = req.body;
    logger.debug(`Controller: Received request to update user id: ${userId}`, {
      body,
    });
    try {
      if (!userId || isNaN(Number(userId))) {
        throw new Error('Invalid user id');
      }
      if (!body) {
        throw new Error('Request body is missing');
      }

      const userToUpdate = toUpdateUserInput(body);
      const user = this.userService.update(userId, userToUpdate);
      const data = toUserResponse(user);

      const response = {
        message: 'User updated successfully',
        data,
      };
      res.send(response);
    } catch (error) {
      logger.debug({ id: userId, body }, 'Controller: Error updating user');
    }
  };
}
