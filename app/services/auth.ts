import { api } from '@/lib/api';
import type { Rol, Usuario } from '@/types';

export type DatosRegistro = {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: Exclude<Rol, 'ADMIN'>;
};

export async function login(correo: string, contrasena: string) {
  const datos = await api<{ token: string }>('/auth/login', {
    method: 'POST',
    body: { correo, contrasena },
    mensajes: { 401: 'Correo o contraseña incorrectos' },
  });
  return datos.token;
}

export async function registrar(datos: DatosRegistro) {
  await api('/auth/registro', {
    method: 'POST',
    body: datos,
    mensajes: { 409: 'Ya existe una cuenta con ese correo' },
  });
}

export async function obtenerPerfil() {
  const datos = await api<{ usuario: Usuario }>('/me');
  return datos.usuario;
}
