import request from 'supertest';
import express from 'express';
import { NotFoundError, InternalError, GenericError } from '../../../next-socket2/backend/src/core/ApiError';
import { errorHandler } from '../../../next-socket2/backend/src/middlewares/errorHandler.middleware';
import Logger from '../../../next-socket2/backend/src/core/Logger';

describe('Error Handler Middleware', () => {
  const originalEnv: string | undefined = process.env.NODE_ENV;

  afterEach(() => (process.env.NODE_ENV = originalEnv));

  it('should log errors correctly', async () => {
    const appWithInternalError = express();
    const loggerErrorSpy = jest.spyOn(Logger, 'error');

    appWithInternalError.use((req, res, next) => {
      next(new Error('Test error'));
    });
    appWithInternalError.use(errorHandler);

    const response = await request(appWithInternalError).get('/');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error');
    expect(loggerErrorSpy).toHaveBeenCalled();
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('500 - Test error'),
    );
    loggerErrorSpy.mockRestore();
  });

  describe('Generic errors', () => {
    it('should be handled in production mode correctly', async () => {
      process.env.NODE_ENV = 'production';
      const appWithGenericError = express();

      appWithGenericError.use((req, res, next) => {
        next(new GenericError('Generic error'));
      });

      appWithGenericError.use(errorHandler);

      const response = await request(appWithGenericError).get('/');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Something wrong happened.');
    });

    it('should be handled in development mode correctly', async () => {
      process.env.NODE_ENV = 'development';
      const appWithGenericError = express();

      appWithGenericError.use((req, res, next) => {
        next(new GenericError('Generic error'));
      });

      appWithGenericError.use(errorHandler);

      const response = await request(appWithGenericError).get('/');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Generic error');
    });
  });

  describe('NotFound errors', () => {
    it('should be handled in production mode correctly', async () => {
      process.env.NODE_ENV = 'production';
      const appWithNotFoundError = express();

      appWithNotFoundError.use((req, res, next) => {
        next(new NotFoundError('Test NotFoundError'));
      });
      appWithNotFoundError.use(errorHandler);
      const response = await request(appWithNotFoundError).get('/');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Something wrong happened.');
    });

    it('should be handled in development mode correctly', async () => {
      process.env.NODE_ENV = 'development';
      const appWithNotFoundError = express();

      appWithNotFoundError.use((req, res, next) => {
        next(new NotFoundError('Test NotFoundError'));
      });
      appWithNotFoundError.use(errorHandler);
      const response = await request(appWithNotFoundError).get('/');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Test NotFoundError');
    });
  });

  describe('Internal errors', () => {
    it('should be handled in production mode correctly', async () => {
      process.env.NODE_ENV = 'production';
      const appInProductionError = express();

      appInProductionError.use((req, res, next) => {
        next(new InternalError('Test'));
      });

      appInProductionError.use(errorHandler);

      const response = await request(appInProductionError).get('/');
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Something wrong happened.');
    });

    it('should be handled in development mode correctly', async () => {
      process.env.NODE_ENV = 'development';
      const appInDevelopmentError = express();

      appInDevelopmentError.use((req, res, next) => {
        next(new InternalError('Development environment error'));
      });

      appInDevelopmentError.use(errorHandler);

      const response = await request(appInDevelopmentError).get('/');
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Development environment error');
    });
  });
});
