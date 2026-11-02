import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler, notFound } from './middlewares/error.middleware';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()) }));
app.use(express.json());

app.use(notFound);
app.use(errorHandler);

export default app;
