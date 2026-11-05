import bcrypt from 'bcryptjs';
import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Prisma falso: las pruebas nunca se conectan a una base real
const prismaMock = vi.hoisted(() => ({
  usuario: { findUnique: vi.fn(), create: vi.fn() },
  categoria: { findMany: vi.fn(), count: vi.fn() },
  interesUsuario: { deleteMany: vi.fn(), createMany: vi.fn() },
  $transaction: vi.fn(),
}));

vi.mock('../src/lib/prisma', () => ({ prisma: prismaMock }));

import app from '../src/app';
import { crearToken } from '../src/lib/jwt';
import { authenticate, requireRol } from '../src/middlewares/auth.middleware';
import { errorHandler } from '../src/middlewares/error.middleware';

const usuarioGuardado = {
  id: 1,
  nombre: 'Ana Prueba',
  correo: 'ana@correo.com',
  rol: 'EXPLORADOR',
  creadoEn: new Date('2026-11-01T00:00:00Z'),
  contrasenaHash: bcrypt.hashSync('clave-segura-123', 4),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /auth/registro', () => {
  it('crea la cuenta y normaliza el correo', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue(null);
    prismaMock.usuario.create.mockImplementation(async ({ data }) => ({
      id: 1,
      nombre: data.nombre,
      correo: data.correo,
      rol: data.rol,
      creadoEn: new Date(),
    }));

    const res = await request(app).post('/auth/registro').send({
      nombre: 'Ana Prueba',
      correo: '  Ana@Correo.COM ',
      contrasena: 'clave-segura-123',
      rol: 'EXPLORADOR',
    });

    expect(res.status).toBe(201);
    expect(res.body.usuario.correo).toBe('ana@correo.com');
    expect(res.body.usuario).not.toHaveProperty('contrasenaHash');

    const { data } = prismaMock.usuario.create.mock.calls[0][0];
    expect(data.contrasenaHash).not.toBe('clave-segura-123');
    expect(await bcrypt.compare('clave-segura-123', data.contrasenaHash)).toBe(true);
  });

  it('responde 409 si el correo ya existe', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue(usuarioGuardado);

    const res = await request(app).post('/auth/registro').send({
      nombre: 'Ana Prueba',
      correo: 'ana@correo.com',
      contrasena: 'clave-segura-123',
      rol: 'EXPLORADOR',
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Ya existe una cuenta con ese correo');
    expect(prismaMock.usuario.create).not.toHaveBeenCalled();
  });

  it('no permite registrarse como ADMIN', async () => {
    const res = await request(app).post('/auth/registro').send({
      nombre: 'Intruso',
      correo: 'intruso@correo.com',
      contrasena: 'clave-segura-123',
      rol: 'ADMIN',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('El rol debe ser EXPLORADOR u ORGANIZADOR');
    expect(prismaMock.usuario.create).not.toHaveBeenCalled();
  });
});

describe('POST /auth/login', () => {
  it('devuelve un token y los datos del usuario', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue(usuarioGuardado);

    const res = await request(app)
      .post('/auth/login')
      .send({ correo: 'ANA@correo.com', contrasena: 'clave-segura-123' });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.usuario).toMatchObject({ id: 1, rol: 'EXPLORADOR' });
    expect(res.body.usuario).not.toHaveProperty('contrasenaHash');
  });

  it('responde el mismo mensaje si la contraseña es incorrecta o el correo no existe', async () => {
    prismaMock.usuario.findUnique.mockResolvedValueOnce(usuarioGuardado);
    const malaClave = await request(app)
      .post('/auth/login')
      .send({ correo: 'ana@correo.com', contrasena: 'otra-clave' });

    prismaMock.usuario.findUnique.mockResolvedValueOnce(null);
    const sinCuenta = await request(app)
      .post('/auth/login')
      .send({ correo: 'nadie@correo.com', contrasena: 'otra-clave' });

    expect(malaClave.status).toBe(401);
    expect(sinCuenta.status).toBe(401);
    expect(malaClave.body.error).toBe('Correo o contraseña incorrectos');
    expect(sinCuenta.body.error).toBe(malaClave.body.error);
  });
});

describe('GET /me', () => {
  it('responde 401 sin token', async () => {
    const res = await request(app).get('/me');

    expect(res.status).toBe(401);
    expect(prismaMock.usuario.findUnique).not.toHaveBeenCalled();
  });

  it('responde 401 con un token inválido', async () => {
    const res = await request(app).get('/me').set('Authorization', 'Bearer token-falso');

    expect(res.status).toBe(401);
  });

  it('devuelve el usuario con sus intereses si el token es válido', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue({
      id: 1,
      nombre: 'Ana Prueba',
      correo: 'ana@correo.com',
      rol: 'EXPLORADOR',
      creadoEn: new Date(),
      intereses: [{ categoria: { id: 3, nombre: 'Jazz' } }],
    });
    const token = crearToken({ id: 1, rol: 'EXPLORADOR' });

    const res = await request(app).get('/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.usuario.intereses).toEqual([{ id: 3, nombre: 'Jazz' }]);
    expect(res.body.usuario).not.toHaveProperty('contrasenaHash');
  });
});

describe('requireRol', () => {
  const appPrueba = express();
  appPrueba.get('/solo-admin', authenticate, requireRol('ADMIN'), (_req, res) => {
    res.json({ ok: true });
  });
  appPrueba.use(errorHandler);

  it('responde 403 si el rol no corresponde', async () => {
    const token = crearToken({ id: 2, rol: 'ORGANIZADOR' });

    const res = await request(appPrueba).get('/solo-admin').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('No tienes permiso para realizar esta acción');
  });

  it('deja pasar si el rol corresponde', async () => {
    const token = crearToken({ id: 3, rol: 'ADMIN' });

    const res = await request(appPrueba).get('/solo-admin').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});

describe('categorías e intereses', () => {
  it('GET /categorias es público', async () => {
    prismaMock.categoria.findMany.mockResolvedValue([{ id: 3, nombre: 'Jazz' }]);

    const res = await request(app).get('/categorias');

    expect(res.status).toBe(200);
    expect(res.body.categorias).toEqual([{ id: 3, nombre: 'Jazz' }]);
  });

  it('PUT /me/intereses responde 400 si una categoría no existe', async () => {
    prismaMock.categoria.count.mockResolvedValue(1);
    const token = crearToken({ id: 1, rol: 'EXPLORADOR' });

    const res = await request(app)
      .put('/me/intereses')
      .set('Authorization', `Bearer ${token}`)
      .send({ categoriaIds: [3, 999] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Alguna de las categorías elegidas no existe');
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });
});
