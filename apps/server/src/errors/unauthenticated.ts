import { StatusCodes } from 'http-status-codes';
import { CustomError } from './custom-error';

export class UnauthenticatedError extends CustomError {
  constructor(errorMessage: string) {
    super(errorMessage, StatusCodes.UNAUTHORIZED);
    Object.setPrototypeOf(this, UnauthenticatedError.prototype);
  }
}
