import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export async function registro(req: Request, res: Response) {
  const usuario = await authService.registrar(req.body);
  res.status(201).json({ ok: true, usuario });
}

export async function login(req: Request, res: Response) {
  const { token, usuario } = await authService.login(req.body);
  res.json({ ok: true, token, usuario });
}
