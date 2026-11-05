import { Request, Response } from 'express';
import { listarCategorias } from '../services/categoria.service';

export async function getCategorias(_req: Request, res: Response) {
  const categorias = await listarCategorias();
  res.json({ ok: true, categorias });
}
