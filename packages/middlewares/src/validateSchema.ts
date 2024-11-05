import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError as ZE } from 'zod';
import { ZodError } from '@trg_package/errors';

interface IValidator {
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
}
export function validateSchema<TBody = any, TParams = any, TQuery = any>(validator: IValidator) {
  return async (req: Request<TParams,any,TBody,TQuery>, res: Response, next: NextFunction) => {
    try {
      if (validator.body) {
        req.body = await validator.body.parseAsync(req.body) as TBody;
      }
      if (validator.params) {
        req.params = await validator.params.parseAsync(req.params) as TParams;
      }
      if (validator.query) {
        req.query = await validator.query.parseAsync(req.query) as TQuery;
      }
      return next();
    } catch (err) {
      let error = err;
      if (err instanceof ZE) {
        error = new ZodError(err.message);
      }
      console.error('Could not parse the request');
      next(error);
    }
  };
}
