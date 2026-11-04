import { prisma } from '../lib/prisma';
import { HttpError } from '../lib/http-error';
import { datosPublicos } from './auth.service';

export async function obtenerPerfil(id: number) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: {
      ...datosPublicos,
      intereses: { select: { categoria: { select: { id: true, nombre: true } } } },
    },
  });

  if (!usuario) {
    throw new HttpError(404, 'El usuario ya no existe');
  }

  return {
    ...usuario,
    intereses: usuario.intereses.map((interes) => interes.categoria),
  };
}

export async function actualizarIntereses(usuarioId: number, categoriaIds: number[]) {
  const ids = [...new Set(categoriaIds)];

  const existentes = await prisma.categoria.count({ where: { id: { in: ids } } });
  if (existentes !== ids.length) {
    throw new HttpError(400, 'Alguna de las categorías elegidas no existe');
  }

  await prisma.$transaction([
    prisma.interesUsuario.deleteMany({ where: { usuarioId } }),
    prisma.interesUsuario.createMany({
      data: ids.map((categoriaId) => ({ usuarioId, categoriaId })),
    }),
  ]);

  return obtenerPerfil(usuarioId);
}
