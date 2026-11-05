import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../lib/http-error';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof HttpError) {
    res.status(error.status).json({ ok: false, error: error.message });
    return;
  }

  if (error instanceof ZodError) {
    const detalles = error.issues.map((issue) => ({
      campo: issue.path.join('.'),
      mensaje: issue.message,
    }));
    res.status(400).json({ ok: false, error: detalles[0].mensaje, detalles });
    return;
  }

  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ ok: false, error: 'El cuerpo de la petición no es un JSON válido' });
    return;
  }

  console.error(error);
  res.status(500).json({ ok: false, error: 'Ocurrió un error inesperado. Intenta de nuevo.' });
}
