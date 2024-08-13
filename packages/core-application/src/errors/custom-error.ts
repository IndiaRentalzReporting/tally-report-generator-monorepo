export class CustomError extends Error {
  readonly status: number;

  constructor(errorMessage: string, status: number) {
    super(errorMessage);
    Object.setPrototypeOf(this, CustomError.prototype);
    this.status = status;
  }
}
