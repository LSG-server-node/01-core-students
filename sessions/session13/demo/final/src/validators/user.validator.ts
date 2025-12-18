// Defines Joi schemas for validating user-related requests.
// Ensures that incoming data adheres to the required structure and rules.

import Joi from 'joi';

export class UserValidator {
  // Common options you should use when validating:
  // schema.validate(input, { abortEarly: false, convert: true, stripUnknown: true });

  private static readonly id = Joi.string().trim();

  private static readonly email = Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } }); // Disable TLD validation for flexibility

  private static readonly name = Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[\p{L}\p{M} ]+$/u); // Allows letters (including accented), spaces

  private static readonly password = Joi.string().trim();

  // Accept ISO date strings or Date objects; Joi will convert when { convert: true }.
  private static readonly birthday = Joi.date().iso();

  // Coercion equivalent to your normalizeUserData() (truthy/falsy strings + numbers) if { convert: true }.
  private static readonly isBlocked = Joi.boolean()
    .truthy(1, '1', 'true', 'yes', 'y', 'sí', 'si')
    .falsy(0, '0', 'false', 'no', 'n');

  // Pagination: allow querystring strings, convert them to numbers if { convert: true }.
  private static readonly skip = Joi.number().integer().min(0);
  private static readonly limit = Joi.number().integer().min(1).max(100);

  static readonly userIdSchema = Joi.object({
    id: UserValidator.id.required(),
  });

  static readonly userPaginationSchema = Joi.object({
    skip: UserValidator.skip,
    limit: UserValidator.limit,
  }).and('skip', 'limit'); // both or none

  static readonly userCreateSchema = Joi.object({
    name: UserValidator.name.required(),
    email: UserValidator.email.required(),
    password: UserValidator.password.required(),
    birthday: UserValidator.birthday.required(),
    // if you want to allow create with isBlocked, add it here:
    // isBlocked: UserValidator.isBlocked.default(false),
  });

  static readonly userUpdateSchema = Joi.object({
    name: UserValidator.name,
    email: UserValidator.email,
    password: UserValidator.password,
    birthday: UserValidator.birthday,
    isBlocked: UserValidator.isBlocked,
  }).min(1); // avoid empty PATCH/PUT requests
}
