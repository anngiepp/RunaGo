import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler, notFound } from './middlewares/error.middleware';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()) }));
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
