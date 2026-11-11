import { prisma } from '../lib/prisma';
import { HttpError } from '../lib/http-error';
import { distanciaKm, redondear } from '../lib/distancia';
import type { Prisma } from '../generated/prisma/client';
import type { CercaQuery, EventosQuery } from '../validators/eventos.validator';

export const incluirEvento = {
  categoria: { select: { id: true, nombre: true } },
  organizador: { select: { nombre: true } },
  lugar: {
    select: {
      id: true,
      nombre: true,
      direccion: true,
      distrito: true,
      latitud: true,
      longitud: true,
      paraderoCercano: true,
      servicioTransporte: true,
      minutosAPie: true,
    },
  },
} satisfies Prisma.EventoInclude;

export type EventoConDatos = Prisma.EventoGetPayload<{ include: typeof incluirEvento }>;

// Publicados y que todavía no terminan (si no tienen fecha de fin, que no hayan empezado)
export function eventosProximos(ahora = new Date()): Prisma.EventoWhereInput {
  return {
    estado: 'PUBLICADO',
    OR: [{ fechaFin: { gte: ahora } }, { fechaFin: null, fechaInicio: { gte: ahora } }],
  };
}

// Deja el evento listo para responder: precio como número y sin ids internos
export function formatearEvento(evento: EventoConDatos, favoritos?: Set<number>) {
  return {
    id: evento.id,
    titulo: evento.titulo,
    descripcion: evento.descripcion,
    etiquetas: evento.etiquetas,
    fechaInicio: evento.fechaInicio,
    fechaFin: evento.fechaFin,
    latitud: evento.latitud,
    longitud: evento.longitud,
    imagenUrl: evento.imagenUrl,
    precioReferencia: evento.precioReferencia === null ? null : Number(evento.precioReferencia),
    categoria: evento.categoria,
    lugar: evento.lugar,
    organizador: evento.organizador,
    ...(favoritos && { esFavorito: favoritos.has(evento.id) }),
  };
}

export async function idsFavoritos(usuarioId?: number) {
  if (!usuarioId) return undefined;
  const favoritos = await prisma.favorito.findMany({
    where: { usuarioId },
    select: { eventoId: true },
  });
  return new Set(favoritos.map((favorito) => favorito.eventoId));
}

function filtrosDeBusqueda(filtros: EventosQuery): Prisma.EventoWhereInput[] {
  const condiciones: Prisma.EventoWhereInput[] = [];

  if (filtros.category) {
    condiciones.push({ categoriaId: filtros.category });
  }
  if (filtros.interest) {
    condiciones.push({
      OR: [
        { categoria: { nombre: { equals: filtros.interest, mode: 'insensitive' } } },
        { etiquetas: { has: filtros.interest.toLowerCase() } },
      ],
    });
  }
  if (filtros.district) {
    condiciones.push({ lugar: { distrito: { equals: filtros.district, mode: 'insensitive' } } });
  }
  if (filtros.q) {
    condiciones.push({
      OR: [
        { titulo: { contains: filtros.q, mode: 'insensitive' } },
        { descripcion: { contains: filtros.q, mode: 'insensitive' } },
        { etiquetas: { has: filtros.q.toLowerCase() } },
      ],
    });
  }
  if (filtros.from || filtros.to) {
    condiciones.push({ fechaInicio: { gte: filtros.from, lte: filtros.to } });
  }

  return condiciones;
}

export async function listarEventos(filtros: EventosQuery, usuarioId?: number) {
  const where: Prisma.EventoWhereInput = {
    AND: [eventosProximos(), ...filtrosDeBusqueda(filtros)],
  };

  const [eventos, total, favoritos] = await Promise.all([
    prisma.evento.findMany({
      where,
      include: incluirEvento,
      orderBy: [{ fechaInicio: 'asc' }, { id: 'asc' }],
      skip: (filtros.page - 1) * filtros.limit,
      take: filtros.limit,
    }),
    prisma.evento.count({ where }),
    idsFavoritos(usuarioId),
  ]);

  return {
    eventos: eventos.map((evento) => formatearEvento(evento, favoritos)),
    pagina: filtros.page,
    porPagina: filtros.limit,
    total,
    totalPaginas: Math.ceil(total / filtros.limit),
  };
}

export async function eventosCerca({ lat, lng, radiusKm }: CercaQuery, usuarioId?: number) {
  // Primero un recuadro aproximado en la base; luego la distancia exacta con Haversine
  const gradosLat = radiusKm / 111;
  const gradosLng = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  const [eventos, favoritos] = await Promise.all([
    prisma.evento.findMany({
      where: {
        AND: [
          eventosProximos(),
          { latitud: { gte: lat - gradosLat, lte: lat + gradosLat } },
          { longitud: { gte: lng - gradosLng, lte: lng + gradosLng } },
        ],
      },
      include: incluirEvento,
    }),
    idsFavoritos(usuarioId),
  ]);

  const origen = { latitud: lat, longitud: lng };
  const cercanos = eventos
    .map((evento) => ({
      ...formatearEvento(evento, favoritos),
      distanciaKm: redondear(distanciaKm(origen, evento)),
    }))
    .filter((evento) => evento.distanciaKm <= radiusKm)
    .sort((a, b) => a.distanciaKm - b.distanciaKm);

  return { eventos: cercanos, radioKm: radiusKm, total: cercanos.length };
}

export async function obtenerEvento(id: number, usuarioId?: number) {
  const [evento, resenas, favoritos] = await Promise.all([
    prisma.evento.findFirst({
      where: { id, estado: 'PUBLICADO' },
      include: incluirEvento,
    }),
    prisma.resena.aggregate({
      where: { eventoId: id },
      _avg: { calificacion: true },
      _count: true,
    }),
    idsFavoritos(usuarioId),
  ]);

  if (!evento) {
    throw new HttpError(404, 'No encontramos ese evento');
  }

  const promedio = resenas._avg.calificacion;
  return {
    ...formatearEvento(evento, favoritos),
    resenas: {
      promedio: promedio === null ? null : redondear(promedio, 1),
      total: resenas._count,
    },
  };
}

export async function listarDistritos() {
  const lugares = await prisma.lugar.findMany({
    distinct: ['distrito'],
    select: { distrito: true },
    orderBy: { distrito: 'asc' },
  });
  return lugares.map((lugar) => lugar.distrito);
}
