import type { Rol } from '@/types';

const nombresRol: Record<Rol, string> = {
  EXPLORADOR: 'Explorador',
  ORGANIZADOR: 'Organizador',
  ADMIN: 'Administrador',
};

export function nombreRol(rol: Rol) {
  return nombresRol[rol];
}

export function primerNombre(nombre: string) {
  return nombre.trim().split(' ')[0];
}
