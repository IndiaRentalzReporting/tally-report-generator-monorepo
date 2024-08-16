import { CustomError } from './custom-error';

export class ZodError extends CustomError {
  constructor(errorMessage: string) {
    super(errorMessage, 422);
    Object.setPrototypeOf(this, ZodError.prototype);
  }
}
