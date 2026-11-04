import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { HttpError } from '../lib/http-error';
import { crearToken } from '../lib/jwt';
import type { LoginInput, RegistroInput } from '../validators/auth.validator';

export const datosPublicos = {
  id: true,
  nombre: true,
  correo: true,
  rol: true,
  creadoEn: true,
} as const;

export async function registrar(datos: RegistroInput) {
  const existente = await prisma.usuario.findUnique({ where: { correo: datos.correo } });
  if (existente) {
    throw new HttpError(409, 'Ya existe una cuenta con ese correo');
  }

  return prisma.usuario.create({
    data: {
      nombre: datos.nombre,
      correo: datos.correo,
      contrasenaHash: await bcrypt.hash(datos.contrasena, 10),
      rol: datos.rol,
    },
    select: datosPublicos,
  });
}

export async function login(datos: LoginInput) {
  const usuario = await prisma.usuario.findUnique({ where: { correo: datos.correo } });
  const contrasenaValida = usuario
    ? await bcrypt.compare(datos.contrasena, usuario.contrasenaHash)
    : false;

  if (!usuario || !contrasenaValida) {
    throw new HttpError(401, 'Correo o contraseña incorrectos');
  }

  const { id, nombre, correo, rol, creadoEn } = usuario;
  return { token: crearToken(usuario), usuario: { id, nombre, correo, rol, creadoEn } };
}
