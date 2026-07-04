import { Response } from 'express';
import { HTTP_STATUS, ERROR_CODES } from '../constants/env.constants';
import { AppError } from '../errors';

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function errorResponse(
  res: Response,
  message: string,
  code: string = ERROR_CODES.INTERNAL_SERVER_ERROR,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  details?: unknown
): Response {
  const response: ErrorResponse = {
    success: false,
    error: {
      code,
      message
    }
  };

  if (details !== undefined) {
    response.error.details = details;
  }

  return res.status(statusCode).json(response);
}

export function appErrorResponse(res: Response, error: AppError): Response {
  return errorResponse(res, error.message, error.code, error.statusCode);
}
