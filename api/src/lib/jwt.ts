import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import type { Rol } from '../generated/prisma/client';

export type UsuarioToken = { id: number; rol: Rol };

export function crearToken(usuario: UsuarioToken) {
  return jwt.sign({ rol: usuario.rol }, env.JWT_SECRET, {
    subject: String(usuario.id),
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    algorithm: 'HS256',
  });
}

export function verificarToken(token: string): UsuarioToken {
  const payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
  if (typeof payload === 'string' || !payload.sub) {
    throw new Error('Token sin datos de usuario');
  }
  return { id: Number(payload.sub), rol: payload.rol };
}
