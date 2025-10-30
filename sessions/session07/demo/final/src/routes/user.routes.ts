// Defines the routes for user-related operations.
// Maps HTTP methods and endpoints to the corresponding controller methods.

import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const userController = new UserController();
export const userRouter = Router();

userRouter.get('/', userController.getAll);
userRouter.get('/:id', userController.getById);
userRouter.delete('/:id', userController.delete);
