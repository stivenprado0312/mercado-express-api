import { Response } from 'express';

export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

export function successResponse<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response {
  const response: SuccessResponse<T> = {
    success: true,
    message
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

export function createdResponse<T>(res: Response, message: string, data?: T): Response {
  return successResponse(res, message, data, 201);
}

export function noContentResponse(res: Response): Response {
  return res.status(204).send();
}
