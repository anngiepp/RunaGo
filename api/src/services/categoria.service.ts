import { prisma } from '../lib/prisma';

export function listarCategorias() {
  return prisma.categoria.findMany({ orderBy: { nombre: 'asc' } });
}
