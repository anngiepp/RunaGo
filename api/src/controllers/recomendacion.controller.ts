import { Request, Response } from 'express';
import { recomendar } from '../services/recommender.service';
import { ubicacionOpcionalSchema } from '../validators/eventos.validator';

export async function getRecomendaciones(req: Request, res: Response) {
  const { lat, lng } = ubicacionOpcionalSchema.parse(req.query);
  const ubicacion =
    lat !== undefined && lng !== undefined ? { latitud: lat, longitud: lng } : undefined;
  const eventos = await recomendar(req.usuario!.id, ubicacion);
  res.json({ ok: true, eventos });
}
