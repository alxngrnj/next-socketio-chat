import fs from 'fs';
import path from 'path';
import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
let dir = process.env.LOG_DIR;

if (!dir) dir = path.resolve('logs');
/* istanbul ignore next */
if (!fs.existsSync(dir)) fs.mkdirSync(dir);
/* istanbul ignore next */
const logLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'warn';

const dailyRotateFile = new DailyRotateFile({
  level: logLevel,
  filename: dir + '/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  handleExceptions: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json(),
  ),
});

export default createLogger({
  transports: [
    new transports.Console({
      silent: process.env.NODE_ENV === 'test',
      level: logLevel,
      format: format.combine(
        format.errors({ stack: true }),
        format.prettyPrint(),
      ),
    }),
    dailyRotateFile,
  ],
  exceptionHandlers: [dailyRotateFile],
  exitOnError: false,
});
