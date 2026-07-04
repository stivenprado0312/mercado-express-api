import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../shared/errors/index';
import { appErrorResponse, errorResponse } from '../shared/responses/index';
import { logger } from '../shared/logger/index';
import { HTTP_STATUS, ERROR_CODES } from '../shared/constants/env.constants';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    appErrorResponse(res, err);
    return;
  }

  if (err instanceof ZodError) {
    const details = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));

    errorResponse(
      res,
      'Error de validación',
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      details
    );
    return;
  }

  logger.error({ err }, 'Error no manejado');

  errorResponse(
    res,
    'Error interno del servidor',
    ERROR_CODES.INTERNAL_SERVER_ERROR,
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
}
