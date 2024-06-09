import { Response } from 'express';

import { InternalErrorResponse, NotFoundErrorResponse } from './ApiResponse';

export enum ErrorType {
  GENERIC = 'GenericError',
  INTERNAL = 'InternalError',
  NOT_FOUND = 'NotFoundError',
}

export abstract class ApiError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
  ) {
    super(type);
  }

  public static handle(err: ApiError, res: Response): Response {
    switch (err.type) {
      case ErrorType.INTERNAL:
        if (process.env.NODE_ENV === 'production')
          err.message = 'Something wrong happened.';
        return new InternalErrorResponse(err.message).send(res);
      case ErrorType.NOT_FOUND:
        if (process.env.NODE_ENV === 'production')
          err.message = 'Something wrong happened.';
        return new NotFoundErrorResponse(err.message).send(res);
      default: {
        if (process.env.NODE_ENV === 'production')
          err.message = 'Something wrong happened.';
        return new InternalErrorResponse(err.message).send(res);
      }
    }
  }
}

export class InternalError extends ApiError {
  constructor(message: string) {
    super(ErrorType.INTERNAL, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(ErrorType.NOT_FOUND, message);
  }
}

export class GenericError extends ApiError {
  constructor(message = 'Error') {
    super(ErrorType.GENERIC, message);
  }
}
