import { StatusCodes } from 'http-status-codes';
import { CustomError } from './custom-error';

export class DatabaseError extends CustomError {
  constructor(
    errorMessage: string,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(errorMessage, statusCode);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class CreateError extends DatabaseError {
  constructor(entity: string, data: Object) {
    super(
      `Failed to insert ${entity} with data: ${JSON.stringify(data)}`,
      StatusCodes.BAD_REQUEST
    );
  }
}

export class ReadError extends DatabaseError {
  constructor(entity: string, query: Object) {
    super(
      `Failed to read ${entity} with query: ${JSON.stringify(query)}`,
      StatusCodes.NOT_FOUND
    );
  }
}

export class UpdateError extends DatabaseError {
  constructor(entity: string, data: Object) {
    super(
      `Failed to update ${entity} with data: ${JSON.stringify(data)}`,
      StatusCodes.BAD_REQUEST
    );
  }
}

export class DeleteError extends DatabaseError {
  constructor(entity: string, id: string) {
    super(`Failed to delete ${entity} with id: ${id}`, StatusCodes.BAD_REQUEST);
  }
}
