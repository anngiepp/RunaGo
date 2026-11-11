import { Request, Response } from 'express';
import * as eventoService from '../services/evento.service';
import {
  cercaQuerySchema,
  eventoIdSchema,
  eventosQuerySchema,
} from '../validators/eventos.validator';

export async function getEventos(req: Request, res: Response) {
  const filtros = eventosQuerySchema.parse(req.query);
  const resultado = await eventoService.listarEventos(filtros, req.usuario?.id);
  res.json({ ok: true, ...resultado });
}

export async function getEventosCerca(req: Request, res: Response) {
  const consulta = cercaQuerySchema.parse(req.query);
  const resultado = await eventoService.eventosCerca(consulta, req.usuario?.id);
  res.json({ ok: true, ...resultado });
}

export async function getEvento(req: Request, res: Response) {
  const { id } = eventoIdSchema.parse(req.params);
  const evento = await eventoService.obtenerEvento(id, req.usuario?.id);
  res.json({ ok: true, evento });
}

export async function getDistritos(_req: Request, res: Response) {
  const distritos = await eventoService.listarDistritos();
  res.json({ ok: true, distritos });
}
