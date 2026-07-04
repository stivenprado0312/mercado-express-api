import { Request, Response } from 'express';
import { errorResponse } from '../shared/responses/index';
import { HTTP_STATUS, ERROR_CODES } from '../shared/constants/env.constants';

export function notFoundMiddleware(req: Request, res: Response): void {
  errorResponse(
    res,
    `Ruta ${req.method} ${req.path} no encontrada`,
    ERROR_CODES.NOT_FOUND,
    HTTP_STATUS.NOT_FOUND
  );
}
