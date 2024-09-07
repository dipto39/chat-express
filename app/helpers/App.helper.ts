import { Response } from 'express';

const successResponse = <T>(
  res: Response,
  message: string,
  data: T | null = null,
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    error: false,
    message,
    data,
  });
};

const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400,
  data: any = null
) => {
  return res.status(statusCode).json({
    error: true,
    message,
    data,
  });
};

export { successResponse, errorResponse };
