import { StatusCodes } from 'http-status-codes';
import { CustomError } from './custom-error';

export class ConfigError extends CustomError {
  constructor(errorMessage: string) {
    super(errorMessage, StatusCodes.BAD_REQUEST);
    Object.setPrototypeOf(this, ConfigError.prototype);
  }
}
