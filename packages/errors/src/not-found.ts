import { StatusCodes } from 'http-status-codes';
import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  constructor(errorMessage: string) {
    super(errorMessage, StatusCodes.NOT_FOUND);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
