import type { UsuarioToken } from '../lib/jwt';

declare module 'express-serve-static-core' {
  interface Request {
    usuario?: UsuarioToken;
  }
}
