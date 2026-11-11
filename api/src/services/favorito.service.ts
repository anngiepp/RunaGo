import { prisma } from '../lib/prisma';
import { HttpError } from '../lib/http-error';
import { distanciaKm, redondear } from '../lib/distancia';
import { eventosProximos, formatearEvento, incluirEvento } from './evento.service';

// Supuestos para estimar los tramos del plan (distancia en línea recta):
// menos de 1 km se camina a 5 km/h; desde 1 km se va en transporte público a 20 km/h
export const VELOCIDAD_A_PIE_KMH = 5;
export const VELOCIDAD_TRANSPORTE_KMH = 20;
export const DISTANCIA_MAXIMA_A_PIE_KM = 1;

async function verificarEvento(eventoId: number) {
  const evento = await prisma.evento.findFirst({
    where: { id: eventoId, estado: 'PUBLICADO' },
    select: { id: true },
  });
  if (!evento) {
    throw new HttpError(404, 'No encontramos ese evento');
  }
}

export async function agregarFavorito(usuarioId: number, eventoId: number) {
  await verificarEvento(eventoId);
  return prisma.favorito.upsert({
    where: { usuarioId_eventoId: { usuarioId, eventoId } },
    update: {},
    create: { usuarioId, eventoId },
    select: { eventoId: true, enPlan: true, guardadoEn: true },
  });
}

export async function quitarFavorito(usuarioId: number, eventoId: number) {
  await prisma.favorito.deleteMany({ where: { usuarioId, eventoId } });
}

export async function listarFavoritos(usuarioId: number) {
  const favoritos = await prisma.favorito.findMany({
    where: { usuarioId },
    include: { evento: { include: incluirEvento } },
    orderBy: { guardadoEn: 'desc' },
  });

  return favoritos.map((favorito) => ({
    ...formatearEvento(favorito.evento),
    esFavorito: true,
    enPlan: favorito.enPlan,
    guardadoEn: favorito.guardadoEn,
  }));
}

// Agregar al plan también lo guarda en favoritos
export async function cambiarPlan(usuarioId: number, eventoId: number, enPlan: boolean) {
  if (enPlan) {
    await verificarEvento(eventoId);
    await prisma.favorito.upsert({
      where: { usuarioId_eventoId: { usuarioId, eventoId } },
      update: { enPlan: true },
      create: { usuarioId, eventoId, enPlan: true },
    });
  } else {
    await prisma.favorito.updateMany({ where: { usuarioId, eventoId }, data: { enPlan: false } });
  }
  return { eventoId, enPlan };
}

export function estimarTramo(distancia: number) {
  const aPie = distancia < DISTANCIA_MAXIMA_A_PIE_KM;
  const velocidad = aPie ? VELOCIDAD_A_PIE_KMH : VELOCIDAD_TRANSPORTE_KMH;
  return {
    distanciaKm: redondear(distancia),
    minutos: Math.max(1, Math.ceil((distancia / velocidad) * 60)),
    modo: aPie ? ('A_PIE' as const) : ('TRANSPORTE_PUBLICO' as const),
  };
}

export async function obtenerPlan(usuarioId: number) {
  const favoritos = await prisma.favorito.findMany({
    where: { usuarioId, enPlan: true, evento: eventosProximos() },
    include: { evento: { include: incluirEvento } },
    orderBy: { evento: { fechaInicio: 'asc' } },
  });

  const paradas = favoritos.map((favorito) => ({
    ...formatearEvento(favorito.evento),
    esFavorito: true,
    enPlan: true,
  }));

  const tramos = paradas.slice(1).map((hasta, i) => {
    const desde = paradas[i];
    return {
      desdeEventoId: desde.id,
      hastaEventoId: hasta.id,
      ...estimarTramo(distanciaKm(desde, hasta)),
    };
  });

  return {
    paradas,
    tramos,
    minutosTotales: tramos.reduce((suma, tramo) => suma + tramo.minutos, 0),
  };
}
