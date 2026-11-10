const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
const TIEMPO_LIMITE = 15000;
const SIN_CONEXION = 'No pudimos conectar. Revisa tu internet e inténtalo de nuevo';

const mensajesPorEstado: Record<number, string> = {
  401: 'Tu sesión expiró. Vuelve a iniciar sesión',
  403: 'No tienes permiso para hacer esto',
  404: 'No encontramos lo que buscabas',
};

export type ErrorCampo = { campo: string; mensaje: string };

export class ApiError extends Error {
  status: number;
  detalles: ErrorCampo[];

  constructor(status: number, mensaje: string, detalles: ErrorCampo[] = []) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

let tokenActual: string | null = null;

export function usarToken(token: string | null) {
  tokenActual = token;
}

type Opciones = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  mensajes?: Record<number, string>;
};

export async function api<T>(ruta: string, { method = 'GET', body, mensajes }: Opciones = {}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE);

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(tokenActual ? { Authorization: `Bearer ${tokenActual}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controlador.signal,
    });
  } catch {
    throw new ApiError(0, SIN_CONEXION);
  } finally {
    clearTimeout(temporizador);
  }

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const mensaje =
      mensajes?.[respuesta.status] ??
      datos?.error ??
      mensajesPorEstado[respuesta.status] ??
      'Ocurrió un error inesperado. Inténtalo de nuevo';
    throw new ApiError(respuesta.status, mensaje, datos?.detalles ?? []);
  }

  return datos as T;
}
