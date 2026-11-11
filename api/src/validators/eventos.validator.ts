import { z } from 'zod';

const SOLO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

// Acepta "2026-11-20" (se toma en hora de Lima) o una fecha ISO completa
function fecha(nombre: string, finDelDia: boolean) {
  return z
    .string()
    .trim()
    .transform((valor) => {
      if (!SOLO_FECHA.test(valor)) return new Date(valor);
      return new Date(`${valor}T${finDelDia ? '23:59:59.999' : '00:00:00'}-05:00`);
    })
    .refine((valor) => !Number.isNaN(valor.getTime()), {
      error: `${nombre} debe ser una fecha válida, por ejemplo 2026-11-20`,
    });
}

function numero(nombre: string, minimo: number, maximo: number) {
  return z.coerce
    .number({ error: `${nombre} debe ser un número` })
    .min(minimo, `${nombre} debe estar entre ${minimo} y ${maximo}`)
    .max(maximo, `${nombre} debe estar entre ${minimo} y ${maximo}`);
}

const latitud = numero('lat', -90, 90);
const longitud = numero('lng', -180, 180);
const textoOpcional = z
  .string()
  .trim()
  .optional()
  .transform((valor) => valor || undefined);

export const eventosQuerySchema = z
  .object({
    page: z.coerce.number().int('page debe ser un número entero').min(1).default(1),
    limit: z.coerce
      .number()
      .int('limit debe ser un número entero')
      .min(1, 'limit debe estar entre 1 y 50')
      .max(50, 'limit debe estar entre 1 y 50')
      .default(20),
    category: z.coerce
      .number({ error: 'category debe ser el id de una categoría' })
      .int('category debe ser el id de una categoría')
      .positive('category debe ser el id de una categoría')
      .optional(),
    interest: textoOpcional,
    district: textoOpcional,
    q: textoOpcional,
    from: fecha('from', false).optional(),
    to: fecha('to', true).optional(),
  })
  .refine((datos) => !datos.from || !datos.to || datos.from <= datos.to, {
    error: 'from no puede ser posterior a to',
    path: ['from'],
  });

export const cercaQuerySchema = z.object({
  lat: latitud,
  lng: longitud,
  radiusKm: numero('radiusKm', 0.1, 50).default(5),
});

export const ubicacionOpcionalSchema = z
  .object({ lat: latitud.optional(), lng: longitud.optional() })
  .refine((datos) => (datos.lat === undefined) === (datos.lng === undefined), {
    error: 'Envía lat y lng juntos',
    path: ['lat'],
  });

export const eventoIdSchema = z.object({
  id: z.coerce
    .number({ error: 'El id del evento no es válido' })
    .int('El id del evento no es válido')
    .positive('El id del evento no es válido'),
});

export const favoritoParamsSchema = z.object({
  eventId: z.coerce
    .number({ error: 'El id del evento no es válido' })
    .int('El id del evento no es válido')
    .positive('El id del evento no es válido'),
});

export const planSchema = z.object(
  { enPlan: z.boolean({ error: 'enPlan debe ser true o false' }) },
  { error: 'Debes enviar los datos en formato JSON' },
);

export type EventosQuery = z.infer<typeof eventosQuerySchema>;
export type CercaQuery = z.infer<typeof cercaQuerySchema>;
