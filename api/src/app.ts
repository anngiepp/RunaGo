import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import meRoutes from './routes/me.routes';
import categoriaRoutes from './routes/categoria.routes';
import distritoRoutes from './routes/distrito.routes';
import eventoRoutes from './routes/evento.routes';
import favoritoRoutes from './routes/favorito.routes';
import planRoutes from './routes/plan.routes';
import recomendacionRoutes from './routes/recomendacion.routes';
import { errorHandler, notFound } from './middlewares/error.middleware';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()) }));
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/me', meRoutes);
app.use('/categories', categoriaRoutes);
app.use('/categorias', categoriaRoutes); // nombre anterior, lo usa la app desde el Sprint 1
app.use('/districts', distritoRoutes);
app.use('/events', eventoRoutes);
app.use('/favorites', favoritoRoutes);
app.use('/plan', planRoutes);
app.use('/recommendations', recomendacionRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
