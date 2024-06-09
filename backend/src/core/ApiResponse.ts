import { Response } from 'express';

enum StatusCode {
  FAILURE = '10001',
  RETRY = '10002',
  INVALID_ACCESS_TOKEN = '10003',
}

enum ResponseStatus {
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

abstract class ApiResponse {
  constructor(
    protected statusCode: StatusCode,
    protected status: ResponseStatus,
    protected message: string,
  ) {}

  protected prepare<T extends ApiResponse>(
    res: Response,
    response: T,
    headers: { [key: string]: string },
  ): Response {
    for (const [key, value] of Object.entries(headers)) res.append(key, value);
    return res.status(this.status).json(ApiResponse.sanitize(response));
  }

  public send(
    res: Response,
    headers: { [key: string]: string } = {},
  ): Response {
    return this.prepare<ApiResponse>(res, this, headers);
  }

  private static sanitize<T extends ApiResponse>(response: T): T {
    const clone: T = {} as T;
    Object.assign(clone, response);
    /* istanbul ignore next */
    for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
    return clone;
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(message = 'Internal Error') {
    super(StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message);
  }
}

export class NotFoundErrorResponse extends ApiResponse {
  constructor(message = 'Not Found') {
    super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message);
  }
}
