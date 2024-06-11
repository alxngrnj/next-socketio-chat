import request from 'supertest';
import app from '../../../next-socket2/backend/src/app';
import Logger from '../../../next-socket2/backend/src/core/Logger';

jest.mock('../core/Logger.ts');
describe('Express App', () => {
  // Ideally it should involve more CORS assertions
  it('should set up CORS middleware properly', async () => {
    const response = await request(app).options('/');

    expect(response.headers['access-control-allow-origin']).toBe(
      process.env.CORS_URL,
    );
  });

  it('should register uncaughtException handler', () => {
    const loggerErrorSpy = jest.spyOn(Logger, 'error');

    process.emit('uncaughtException', new Error('Test uncaught exception'));

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      new Error('Test uncaught exception'),
    );

    loggerErrorSpy.mockRestore();
  });
});
