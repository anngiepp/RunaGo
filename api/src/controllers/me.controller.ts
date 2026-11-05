import { Request, Response } from 'express';
import * as usuarioService from '../services/usuario.service';

export async function getMe(req: Request, res: Response) {
  const usuario = await usuarioService.obtenerPerfil(req.usuario!.id);
  res.json({ ok: true, usuario });
}

export async function putIntereses(req: Request, res: Response) {
  const usuario = await usuarioService.actualizarIntereses(req.usuario!.id, req.body.categoriaIds);
  res.json({ ok: true, usuario });
}
