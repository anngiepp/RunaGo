import { prisma } from '../lib/prisma';
import { distanciaKm, redondear, type Punto } from '../lib/distancia';
import { eventosProximos, formatearEvento, idsFavoritos, incluirEvento } from './evento.service';
import type { EventoConDatos } from './evento.service';

// Pesos del recomendador por contenido
export const PUNTOS_POR_INTERES = 3;
export const PUNTOS_MAX_CERCANIA = 3; // a 0 km; baja hasta 0 a los 20 km
export const KM_SIN_PUNTOS = 20;
export const PUNTOS_MAX_FECHA = 2; // hoy; baja hasta 0 a los 30 días
export const DIAS_SIN_PUNTOS = 30;
export const CANTIDAD = 10;

const DIA_MS = 24 * 60 * 60 * 1000;

// "Electrónica" y "electronica" cuentan como lo mismo
export function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
}

export function puntuarEvento(
  evento: EventoConDatos,
  intereses: string[],
  ubicacion?: Punto,
  ahora = new Date(),
) {
  const temasDelEvento = new Set([evento.categoria.nombre, ...evento.etiquetas].map(normalizar));
  const coincidencias = intereses.filter((interes) => temasDelEvento.has(normalizar(interes)));

  const distancia = ubicacion ? distanciaKm(ubicacion, evento) : undefined;
  const puntosCercania =
    distancia === undefined
      ? 0
      : Math.max(0, PUNTOS_MAX_CERCANIA * (1 - distancia / KM_SIN_PUNTOS));

  const dias = Math.max(0, (evento.fechaInicio.getTime() - ahora.getTime()) / DIA_MS);
  const puntosFecha = Math.max(0, PUNTOS_MAX_FECHA * (1 - dias / DIAS_SIN_PUNTOS));

  let motivo = 'Es pronto';
  if (coincidencias.length > 0) {
    motivo = `Coincide con: ${coincidencias.map((interes) => interes.toLowerCase()).join(', ')}`;
  } else if (distancia !== undefined && distancia < 2) {
    motivo = 'Está cerca de ti';
  }

  return {
    puntaje: redondear(coincidencias.length * PUNTOS_POR_INTERES + puntosCercania + puntosFecha),
    motivo,
    distanciaKm: distancia === undefined ? undefined : redondear(distancia),
  };
}

export async function recomendar(usuarioId: number, ubicacion?: Punto) {
  const [intereses, eventos, favoritos] = await Promise.all([
    prisma.interesUsuario.findMany({
      where: { usuarioId },
      select: { categoria: { select: { nombre: true } } },
    }),
    prisma.evento.findMany({ where: eventosProximos(), include: incluirEvento }),
    idsFavoritos(usuarioId),
  ]);

  const nombresIntereses = intereses.map((interes) => interes.categoria.nombre);

  return eventos
    .map((evento) => ({
      ...formatearEvento(evento, favoritos),
      ...puntuarEvento(evento, nombresIntereses, ubicacion),
    }))
    .sort((a, b) => b.puntaje - a.puntaje || a.fechaInicio.getTime() - b.fechaInicio.getTime())
    .slice(0, CANTIDAD);
}
