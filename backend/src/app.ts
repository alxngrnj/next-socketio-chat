import express from 'express';
import Logger from './core/Logger';
import cors from 'cors';
import { NotFoundError } from './core/ApiError';
import { config } from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.middleware';
config({ path: `.env.${process.env.NODE_ENV}` });

process.on('uncaughtException', (e) => Logger.error(e));

const app = express();

app.use(cors({ origin: process.env.CORS_URL, optionsSuccessStatus: 200 }));
app.use((req, res, next) => next(new NotFoundError()));
app.use(errorHandler);

export default app;
