import { NextFunction, Request, Response } from 'express';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ ok: false, error: 'El cuerpo de la petición no es un JSON válido' });
    return;
  }

  console.error(error);
  res.status(500).json({ ok: false, error: 'Ocurrió un error inesperado. Intenta de nuevo.' });
}
