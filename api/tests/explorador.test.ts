import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Prisma falso: las pruebas nunca se conectan a una base real
const prismaMock = vi.hoisted(() => ({
  usuario: { findUnique: vi.fn(), update: vi.fn() },
  categoria: { findMany: vi.fn() },
  lugar: { findMany: vi.fn() },
  evento: { findMany: vi.fn(), findFirst: vi.fn(), count: vi.fn() },
  resena: { aggregate: vi.fn() },
  favorito: {
    findMany: vi.fn(),
    upsert: vi.fn(),
    deleteMany: vi.fn(),
    updateMany: vi.fn(),
  },
  interesUsuario: { findMany: vi.fn() },
}));

vi.mock('../src/lib/prisma', () => ({ prisma: prismaMock }));

import app from '../src/app';
import { crearToken } from '../src/lib/jwt';
import { distanciaKm } from '../src/lib/distancia';
import { estimarTramo } from '../src/services/favorito.service';
import { puntuarEvento } from '../src/services/recommender.service';

const token = crearToken({ id: 7, rol: 'EXPLORADOR' });
const conToken = { Authorization: `Bearer ${token}` };

const barranco = { latitud: -12.1495, longitud: -77.0228 };
const miraflores = { latitud: -12.1211, longitud: -77.0296 };
const centro = { latitud: -12.0471, longitud: -77.036 };

function crearEvento(
  id: number,
  datos: { categoria?: string; etiquetas?: string[]; dias?: number; punto?: typeof barranco } = {},
) {
  const punto = datos.punto ?? barranco;
  const fechaInicio = new Date(Date.now() + (datos.dias ?? 1) * 24 * 60 * 60 * 1000);
  return {
    id,
    organizadorId: 2,
    categoriaId: 1,
    lugarId: 1,
    titulo: `Evento ${id}`,
    descripcion: 'Descripción de prueba',
    etiquetas: datos.etiquetas ?? [],
    fechaInicio,
    fechaFin: null,
    ...punto,
    imagenUrl: null,
    precioReferencia: { toString: () => '35' },
    estado: 'PUBLICADO',
    categoria: { id: 1, nombre: datos.categoria ?? 'Rock' },
    organizador: { nombre: 'Colectivo de prueba' },
    lugar: {
      id: 1,
      nombre: 'Bajada de Baños',
      direccion: 'Bajada de Baños s/n',
      distrito: 'Barranco',
      ...punto,
      paraderoCercano: 'Estación Bulevar',
      servicioTransporte: 'Metropolitano',
      minutosAPie: 7,
    },
  };
}

// Busca una condición dentro del AND que arma el servicio
function condicionesDelListado() {
  return prismaMock.evento.findMany.mock.calls[0][0].where.AND;
}

beforeEach(() => {
  vi.clearAllMocks();
  prismaMock.evento.findMany.mockResolvedValue([crearEvento(1)]);
  prismaMock.evento.count.mockResolvedValue(1);
  prismaMock.favorito.findMany.mockResolvedValue([]);
});

describe('GET /events', () => {
  it('lista solo publicados y no terminados, ordenados por fecha y paginados', async () => {
    const res = await request(app).get('/events');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ok: true, pagina: 1, porPagina: 20, total: 1 });

    const evento = res.body.eventos[0];
    expect(evento.precioReferencia).toBe(35);
    expect(evento.organizador).toEqual({ nombre: 'Colectivo de prueba' });
    expect(evento.lugar.paraderoCercano).toBe('Estación Bulevar');
    expect(evento).not.toHaveProperty('organizadorId');
    expect(evento).not.toHaveProperty('esFavorito');

    const consulta = prismaMock.evento.findMany.mock.calls[0][0];
    expect(consulta.orderBy[0]).toEqual({ fechaInicio: 'asc' });
    expect(consulta.skip).toBe(0);
    expect(consulta.take).toBe(20);
    expect(consulta.where.AND[0].estado).toBe('PUBLICADO');
    expect(consulta.where.AND[0].OR).toHaveLength(2);
  });

  it('calcula la página pedida', async () => {
    prismaMock.evento.count.mockResolvedValue(12);
    const res = await request(app).get('/events?page=3&limit=5');

    expect(res.body.totalPaginas).toBe(3);
    expect(prismaMock.evento.findMany.mock.calls[0][0].skip).toBe(10);
  });

  it('filtra por categoría', async () => {
    await request(app).get('/events?category=4');
    expect(condicionesDelListado()).toContainEqual({ categoriaId: 4 });
  });

  it('filtra por interés (categoría o etiqueta)', async () => {
    await request(app).get('/events?interest=Jazz');
    expect(condicionesDelListado()).toContainEqual({
      OR: [
        { categoria: { nombre: { equals: 'Jazz', mode: 'insensitive' } } },
        { etiquetas: { has: 'jazz' } },
      ],
    });
  });

  it('filtra por distrito', async () => {
    await request(app).get('/events?district=barranco');
    expect(condicionesDelListado()).toContainEqual({
      lugar: { distrito: { equals: 'barranco', mode: 'insensitive' } },
    });
  });

  it('busca texto en título, descripción y etiquetas', async () => {
    await request(app).get('/events?q=Trivia');
    expect(condicionesDelListado()).toContainEqual({
      OR: [
        { titulo: { contains: 'Trivia', mode: 'insensitive' } },
        { descripcion: { contains: 'Trivia', mode: 'insensitive' } },
        { etiquetas: { has: 'trivia' } },
      ],
    });
  });

  it('filtra por rango de fechas en hora de Lima', async () => {
    await request(app).get('/events?from=2026-11-20&to=2026-11-25');
    expect(condicionesDelListado()).toContainEqual({
      fechaInicio: {
        gte: new Date('2026-11-20T05:00:00.000Z'),
        lte: new Date('2026-11-26T04:59:59.999Z'),
      },
    });
  });

  it('responde 400 en español si un filtro no es válido', async () => {
    const fecha = await request(app).get('/events?from=ayer');
    expect(fecha.status).toBe(400);
    expect(fecha.body.error).toBe('from debe ser una fecha válida, por ejemplo 2026-11-20');

    const rango = await request(app).get('/events?from=2026-11-25&to=2026-11-20');
    expect(rango.body.error).toBe('from no puede ser posterior a to');

    const limite = await request(app).get('/events?limit=100');
    expect(limite.body.error).toBe('limit debe estar entre 1 y 50');
  });

  it('agrega esFavorito si llega un token válido', async () => {
    prismaMock.favorito.findMany.mockResolvedValue([{ eventoId: 1 }]);
    const res = await request(app).get('/events').set(conToken);
    expect(res.body.eventos[0].esFavorito).toBe(true);
  });

  it('ignora un token inválido y responde como visitante', async () => {
    const res = await request(app).get('/events').set({ Authorization: 'Bearer malo' });
    expect(res.status).toBe(200);
    expect(res.body.eventos[0]).not.toHaveProperty('esFavorito');
  });
});

describe('GET /events/near', () => {
  it('ordena por distancia y descarta lo que está fuera del radio', async () => {
    prismaMock.evento.findMany.mockResolvedValue([
      crearEvento(1, { punto: centro }),
      crearEvento(2, { punto: miraflores }),
      crearEvento(3, { punto: barranco }),
    ]);

    const res = await request(app).get('/events/near?lat=-12.1495&lng=-77.0228');

    expect(res.status).toBe(200);
    expect(res.body.radioKm).toBe(5);
    expect(res.body.eventos.map((e: { id: number }) => e.id)).toEqual([3, 2]);
    expect(res.body.eventos[0].distanciaKm).toBe(0);
    expect(res.body.eventos[1].distanciaKm).toBeCloseTo(3.2, 1);
  });

  it('responde 400 si faltan o no son válidas las coordenadas', async () => {
    const sinLat = await request(app).get('/events/near?lng=-77.02');
    expect(sinLat.status).toBe(400);
    expect(sinLat.body.error).toBe('lat debe ser un número');

    const fueraDeRango = await request(app).get('/events/near?lat=95&lng=-77.02');
    expect(fueraDeRango.body.error).toBe('lat debe estar entre -90 y 90');

    const radio = await request(app).get('/events/near?lat=-12.1&lng=-77.02&radiusKm=80');
    expect(radio.body.error).toBe('radiusKm debe estar entre 0.1 y 50');
  });
});

describe('GET /events/:id', () => {
  it('devuelve el detalle con el resumen de reseñas', async () => {
    prismaMock.evento.findFirst.mockResolvedValue(crearEvento(1));
    prismaMock.resena.aggregate.mockResolvedValue({ _avg: { calificacion: 4.56 }, _count: 18 });

    const res = await request(app).get('/events/1');

    expect(res.status).toBe(200);
    expect(res.body.evento.titulo).toBe('Evento 1');
    expect(res.body.evento.resenas).toEqual({ promedio: 4.6, total: 18 });
    expect(prismaMock.evento.findFirst.mock.calls[0][0].where).toEqual({
      id: 1,
      estado: 'PUBLICADO',
    });
  });

  it('responde 404 en español si no existe', async () => {
    prismaMock.evento.findFirst.mockResolvedValue(null);
    prismaMock.resena.aggregate.mockResolvedValue({ _avg: { calificacion: null }, _count: 0 });

    const res = await request(app).get('/events/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ ok: false, error: 'No encontramos ese evento' });
  });

  it('responde 400 si el id no es un número', async () => {
    const res = await request(app).get('/events/abc');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('El id del evento no es válido');
  });
});

describe('GET /categories y GET /districts', () => {
  it('lista categorías y distritos', async () => {
    prismaMock.categoria.findMany.mockResolvedValue([{ id: 1, nombre: 'Rock' }]);
    prismaMock.lugar.findMany.mockResolvedValue([
      { distrito: 'Barranco' },
      { distrito: 'Miraflores' },
    ]);

    const categorias = await request(app).get('/categories');
    const distritos = await request(app).get('/districts');

    expect(categorias.body.categorias).toEqual([{ id: 1, nombre: 'Rock' }]);
    expect(distritos.body).toEqual({ ok: true, distritos: ['Barranco', 'Miraflores'] });
  });
});

describe('favoritos', () => {
  it('responden 401 sin token', async () => {
    expect((await request(app).get('/favorites')).status).toBe(401);
    expect((await request(app).post('/favorites/1')).status).toBe(401);
    expect((await request(app).delete('/favorites/1')).status).toBe(401);
    expect((await request(app).put('/favorites/1/plan').send({ enPlan: true })).status).toBe(401);
  });

  it('POST /favorites/:eventId agrega el evento', async () => {
    prismaMock.evento.findFirst.mockResolvedValue({ id: 1 });
    prismaMock.favorito.upsert.mockResolvedValue({
      eventoId: 1,
      enPlan: false,
      guardadoEn: new Date(),
    });

    const res = await request(app).post('/favorites/1').set(conToken);

    expect(res.status).toBe(201);
    expect(res.body.favorito.eventoId).toBe(1);
    expect(prismaMock.favorito.upsert.mock.calls[0][0].create).toEqual({
      usuarioId: 7,
      eventoId: 1,
    });
  });

  it('POST /favorites/:eventId responde 404 si el evento no existe', async () => {
    prismaMock.evento.findFirst.mockResolvedValue(null);

    const res = await request(app).post('/favorites/999').set(conToken);

    expect(res.status).toBe(404);
    expect(prismaMock.favorito.upsert).not.toHaveBeenCalled();
  });

  it('DELETE /favorites/:eventId quita el evento', async () => {
    prismaMock.favorito.deleteMany.mockResolvedValue({ count: 1 });

    const res = await request(app).delete('/favorites/1').set(conToken);

    expect(res.status).toBe(200);
    expect(prismaMock.favorito.deleteMany).toHaveBeenCalledWith({
      where: { usuarioId: 7, eventoId: 1 },
    });
  });

  it('GET /favorites lista los eventos guardados', async () => {
    prismaMock.favorito.findMany.mockResolvedValue([
      { enPlan: true, guardadoEn: new Date(), evento: crearEvento(1) },
      { enPlan: false, guardadoEn: new Date(), evento: crearEvento(2) },
    ]);

    const res = await request(app).get('/favorites').set(conToken);

    expect(res.body.total).toBe(2);
    expect(res.body.favoritos[0]).toMatchObject({ id: 1, esFavorito: true, enPlan: true });
    expect(res.body.favoritos[1].enPlan).toBe(false);
  });
});

describe('plan de salida', () => {
  it('PUT /favorites/:eventId/plan agrega al plan (y guarda en favoritos)', async () => {
    prismaMock.evento.findFirst.mockResolvedValue({ id: 3 });

    const res = await request(app).put('/favorites/3/plan').set(conToken).send({ enPlan: true });

    expect(res.body).toEqual({ ok: true, eventoId: 3, enPlan: true });
    expect(prismaMock.favorito.upsert.mock.calls[0][0].create).toEqual({
      usuarioId: 7,
      eventoId: 3,
      enPlan: true,
    });
  });

  it('PUT /favorites/:eventId/plan valida enPlan', async () => {
    const res = await request(app).put('/favorites/3/plan').set(conToken).send({ enPlan: 'si' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('enPlan debe ser true o false');
  });

  it('GET /plan devuelve las paradas por fecha y los tramos entre ellas', async () => {
    prismaMock.favorito.findMany.mockResolvedValue([
      { evento: crearEvento(1, { punto: barranco, dias: 1 }) },
      { evento: crearEvento(2, { punto: barranco, dias: 2 }) },
      { evento: crearEvento(3, { punto: centro, dias: 3 }) },
    ]);

    const res = await request(app).get('/plan').set(conToken);

    const consulta = prismaMock.favorito.findMany.mock.calls[0][0];
    expect(consulta.where).toMatchObject({ usuarioId: 7, enPlan: true });
    expect(consulta.orderBy).toEqual({ evento: { fechaInicio: 'asc' } });

    expect(res.body.paradas.map((p: { id: number }) => p.id)).toEqual([1, 2, 3]);
    expect(res.body.tramos).toHaveLength(2);
    expect(res.body.tramos[0]).toEqual({
      desdeEventoId: 1,
      hastaEventoId: 2,
      distanciaKm: 0,
      minutos: 1,
      modo: 'A_PIE',
    });

    const largo = res.body.tramos[1];
    expect(largo.modo).toBe('TRANSPORTE_PUBLICO');
    expect(largo.distanciaKm).toBeCloseTo(distanciaKm(barranco, centro), 1);
    expect(largo.minutos).toBe(Math.ceil((distanciaKm(barranco, centro) / 20) * 60));
    expect(res.body.minutosTotales).toBe(1 + largo.minutos);
  });

  it('estima a pie bajo 1 km y en transporte público desde 1 km', () => {
    expect(estimarTramo(0.5)).toEqual({ distanciaKm: 0.5, minutos: 6, modo: 'A_PIE' });
    expect(estimarTramo(10)).toEqual({ distanciaKm: 10, minutos: 30, modo: 'TRANSPORTE_PUBLICO' });
  });
});

describe('GET /recommendations', () => {
  it('responde 401 sin token', async () => {
    expect((await request(app).get('/recommendations')).status).toBe(401);
  });

  it('pone primero lo que coincide con los intereses del usuario', async () => {
    prismaMock.interesUsuario.findMany.mockResolvedValue([
      { categoria: { nombre: 'Rock' } },
      { categoria: { nombre: 'Indie' } },
    ]);
    prismaMock.evento.findMany.mockResolvedValue([
      crearEvento(1, { categoria: 'Teatro', dias: 1 }),
      crearEvento(2, { categoria: 'Rock', etiquetas: ['indie', 'en vivo'], dias: 20 }),
      crearEvento(3, { categoria: 'Jazz', etiquetas: ['rock'], dias: 10 }),
    ]);

    const res = await request(app).get('/recommendations').set(conToken);

    expect(res.status).toBe(200);
    const [primero, segundo, tercero] = res.body.eventos;
    expect(primero).toMatchObject({ id: 2, motivo: 'Coincide con: rock, indie' });
    expect(segundo).toMatchObject({ id: 3, motivo: 'Coincide con: rock' });
    expect(tercero).toMatchObject({ id: 1, motivo: 'Es pronto' });
    expect(primero.puntaje).toBeGreaterThan(segundo.puntaje);
    expect(segundo.puntaje).toBeGreaterThan(tercero.puntaje);
  });

  it('devuelve como máximo 10 eventos', async () => {
    prismaMock.interesUsuario.findMany.mockResolvedValue([]);
    prismaMock.evento.findMany.mockResolvedValue(
      Array.from({ length: 15 }, (_, i) => crearEvento(i + 1, { dias: i + 1 })),
    );

    const res = await request(app).get('/recommendations').set(conToken);
    expect(res.body.eventos).toHaveLength(10);
  });

  it('valida que lat y lng lleguen juntos', async () => {
    const res = await request(app).get('/recommendations?lat=-12.1').set(conToken);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Envía lat y lng juntos');
  });

  it('suma puntos por cercanía y por fecha próxima', () => {
    const ahora = new Date();
    const cerca = puntuarEvento(crearEvento(1, { punto: barranco, dias: 5 }), [], barranco, ahora);
    const lejos = puntuarEvento(crearEvento(2, { punto: centro, dias: 5 }), [], barranco, ahora);
    const pronto = puntuarEvento(crearEvento(3, { dias: 1 }), [], undefined, ahora);
    const tarde = puntuarEvento(crearEvento(4, { dias: 25 }), [], undefined, ahora);

    expect(cerca.puntaje).toBeGreaterThan(lejos.puntaje);
    expect(cerca.motivo).toBe('Está cerca de ti');
    expect(pronto.puntaje).toBeGreaterThan(tarde.puntaje);
  });

  it('no distingue mayúsculas ni tildes entre intereses y etiquetas', () => {
    const evento = crearEvento(1, { categoria: 'Cine', etiquetas: ['electronica'] });
    expect(puntuarEvento(evento, ['Electrónica']).motivo).toBe('Coincide con: electrónica');
  });
});

describe('PATCH /me', () => {
  it('cambia el nombre y devuelve el perfil', async () => {
    prismaMock.usuario.update.mockResolvedValue({});
    prismaMock.usuario.findUnique.mockResolvedValue({
      id: 7,
      nombre: 'Micaela Ríos',
      correo: 'mica@correo.com',
      rol: 'EXPLORADOR',
      creadoEn: new Date(),
      intereses: [],
    });

    const res = await request(app).patch('/me').set(conToken).send({ nombre: '  Micaela Ríos ' });

    expect(res.status).toBe(200);
    expect(res.body.usuario.nombre).toBe('Micaela Ríos');
    expect(prismaMock.usuario.update).toHaveBeenCalledWith({
      where: { id: 7 },
      data: { nombre: 'Micaela Ríos' },
    });
  });

  it('valida el nombre y pide token', async () => {
    const corto = await request(app).patch('/me').set(conToken).send({ nombre: 'M' });
    expect(corto.status).toBe(400);
    expect(corto.body.error).toBe('El nombre debe tener al menos 2 caracteres');

    const sinToken = await request(app).patch('/me').send({ nombre: 'Micaela' });
    expect(sinToken.status).toBe(401);
  });
});

describe('rutas en inglés y anteriores conviven', () => {
  it('PUT /me/interests y PUT /me/intereses existen', async () => {
    for (const ruta of ['/me/interests', '/me/intereses']) {
      const res = await request(app).put(ruta).set(conToken).send({ categoriaIds: 'x' });
      expect(res.status).toBe(400);
    }
  });
});
