// Middleware global de manejo de errores de la aplicación.
// Captura y procesa los errores lanzados en la aplicación, devolviendo las respuestas adecuadas.

import { type NextFunction, type Request, type Response } from 'express';
import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { AppError } from '../utils/application.error';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  logger.error(
    { error: err, path: req.path, method: req.method },
    'An error occurred'
  ); // Loguea el error para fines de depuración

  // Si es un error personalizado (AppError), se utiliza su código de estado y mensaje
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Si no es un error personalizado, se devuelve una respuesta de error genérica
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    error:
      'An unexpected error occurred, please contact the system administrator.',
  });
};
