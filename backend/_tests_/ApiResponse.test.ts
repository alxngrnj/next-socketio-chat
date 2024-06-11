import { Response } from 'express';
import {
  InternalErrorResponse,
  NotFoundErrorResponse,
} from '../src/core/ApiResponse';

const mockResponse: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  append: jest.fn(),
};

describe('Api Response classes', () => {
  describe('NotFoundErrorResponse', () => {
    it('should have a "Not Found" message, if not provided', () => {
      new NotFoundErrorResponse().send(mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: '10001',
        status: 404,
        message: 'Not Found',
      });
    });

    it('should have custom message, if provided', () => {
      new NotFoundErrorResponse('Custom message').send(
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: '10001',
        status: 404,
        message: 'Custom message',
      });
    });
  });

  describe('InternalErrorResponse', () => {
    it('should have a "Internal Error" message, if not provided', () => {
      new InternalErrorResponse().send(mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: '10001',
        status: 500,
        message: 'Internal Error',
      });
    });

    it('should have custom message, if provided', () => {
      new InternalErrorResponse('Custom message').send(
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: '10001',
        status: 500,
        message: 'Custom message',
      });
    });
  });
});
