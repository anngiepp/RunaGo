import { NextFunction, Request, Response } from 'express';
import type { Rol } from '../generated/prisma/client';
import { HttpError } from '../lib/http-error';
import { verificarToken } from '../lib/jwt';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new HttpError(401, 'Debes iniciar sesión para continuar');
  }

  try {
    req.usuario = verificarToken(header.slice(7));
  } catch {
    throw new HttpError(401, 'Tu sesión no es válida o ya expiró. Vuelve a iniciar sesión');
  }
  next();
}

// Si llega un token válido deja al usuario en req.usuario; si no, sigue como visitante
export function authOptional(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      req.usuario = verificarToken(header.slice(7));
    } catch {
      req.usuario = undefined;
    }
  }
  next();
}

export function requireRol(...roles: Rol[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      throw new HttpError(403, 'No tienes permiso para realizar esta acción');
    }
    next();
  };
}
