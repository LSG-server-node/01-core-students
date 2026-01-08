// Maneja operaciones de datos directas relacionadas con usuarios.
// Esta capa interactúa con la base de datos o una fuente de datos para realizar operaciones CRUD.

import logger from '../config/logger';
import { IUser, IUserCreate, IUserUpdate } from '../interfaces/user.interface';
import { IUserModel, UserModel } from '../models/user.model';

export class UserRepository {
  private transformId(user: IUserModel): IUser {
    const { _id, ...rest } = user.toObject();
    return { ...rest, id: _id.toString() };
  }

  getAll = async (
    filters: Record<string, unknown> = {},
    pagination: { skip: number; limit: number } = { skip: 0, limit: 0 }
  ): Promise<IUser[]> => {
    const options = { ...pagination };
    logger.debug(
      `Repository: Finding users with filters: ${JSON.stringify(
        filters
      )} and pagination: ${JSON.stringify(pagination)}`
    );
    const users = await UserModel.find(filters, {}, options);
    logger.debug(`Repository: Found ${users.length} users`);
    return users.map((user: IUserModel) => this.transformId(user));
  };

  getById = async (id: string): Promise<IUser | null> => {
    logger.debug(`Repository: Fetching user by id: ${id}`);
    const user = await UserModel.findById(id);
    if (!user) {
      logger.debug(`Repository: No user found with id: ${id}`);
      return null;
    }
    logger.debug(`Repository: User with id ${id} fetched`);
    return this.transformId(user);
  };

  delete = async (id: string): Promise<IUser | null> => {
    logger.debug(`Repository: Deleting user with id: ${id}`);
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      logger.warn(`Repository: No user found to delete with id: ${id}`);
      return null;
    }
    logger.debug(`Repository: User with id ${id} deleted`);
    return this.transformId(user);
  };

  getByEmail = async (email: string): Promise<IUser | null> => {
    logger.debug(`Repository: Fetching user by email: ${email}`);
    const user = await UserModel.findOne({ email });
    if (!user) {
      logger.debug(`Repository: No user found with email: ${email}`);
      return null;
    }
    logger.debug(`Repository: User with email ${email} fetched`);
    return this.transformId(user);
  };

  create = async (data: IUserCreate): Promise<IUser | null> => {
    logger.debug('Repository: Creating user with data', { data });
    const user = await UserModel.create(data);
    if (!user) {
      logger.debug('Repository: User creation returned null');
      return null;
    }
    logger.debug('Repository: User created and transformed', {
      user: user.toObject(),
    });
    return this.transformId(user);
  };

  update = async (id: string, data: IUserUpdate): Promise<IUser | null> => {
    logger.debug(`Repository: Updating user with id: ${id}`, { data });
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true });
    if (!user) {
      logger.debug(`Repository: No user found to update with id: ${id}`);
      return null;
    }
    logger.debug(`Repository: User with id ${id} updated`);
    return this.transformId(user);
  };
}
