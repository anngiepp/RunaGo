import { Request, Response } from 'express';
import { checkDatabase } from '../services/health.service';

export function getHealth(_req: Request, res: Response) {
  res.json({ ok: true });
}

export async function getDatabaseHealth(_req: Request, res: Response) {
  try {
    await checkDatabase();
    res.json({ ok: true });
  } catch (error) {
    console.error('Fallo la conexión con la base de datos:', error);
    res.status(503).json({ ok: false, error: 'No se pudo conectar con la base de datos' });
  }
}
