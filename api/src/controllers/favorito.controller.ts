import { Request, Response } from 'express';
import * as favoritoService from '../services/favorito.service';
import { favoritoParamsSchema } from '../validators/eventos.validator';

export async function postFavorito(req: Request, res: Response) {
  const { eventId } = favoritoParamsSchema.parse(req.params);
  const favorito = await favoritoService.agregarFavorito(req.usuario!.id, eventId);
  res.status(201).json({ ok: true, favorito });
}

export async function deleteFavorito(req: Request, res: Response) {
  const { eventId } = favoritoParamsSchema.parse(req.params);
  await favoritoService.quitarFavorito(req.usuario!.id, eventId);
  res.json({ ok: true });
}

export async function getFavoritos(req: Request, res: Response) {
  const favoritos = await favoritoService.listarFavoritos(req.usuario!.id);
  res.json({ ok: true, favoritos, total: favoritos.length });
}

export async function putPlan(req: Request, res: Response) {
  const { eventId } = favoritoParamsSchema.parse(req.params);
  const plan = await favoritoService.cambiarPlan(req.usuario!.id, eventId, req.body.enPlan);
  res.json({ ok: true, ...plan });
}

export async function getPlan(req: Request, res: Response) {
  const plan = await favoritoService.obtenerPlan(req.usuario!.id);
  res.json({ ok: true, ...plan });
}
