import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors';

export const errorHandler =
  (NODE_ENV: string) =>
  (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    let statusCode = 500;
    if (err instanceof CustomError) {
      statusCode = err.status;
    }
    res.status(statusCode).json({
      error: err.message,
      stack: NODE_ENV === 'production' ? ':)' : err.stack
    });
  };
