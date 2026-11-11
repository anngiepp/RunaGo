import { api } from '@/lib/api';
import type { Categoria, EventoDetalle, PaginaEventos } from '@/types';

const POR_PAGINA = 10;

export async function listarEventos({
  categoriaId,
  pagina = 1,
}: {
  categoriaId?: number;
  pagina?: number;
}) {
  const parametros = new URLSearchParams({ page: String(pagina), limit: String(POR_PAGINA) });
  if (categoriaId) {
    parametros.set('category', String(categoriaId));
  }
  return api<PaginaEventos>(`/events?${parametros}`);
}

export async function obtenerEvento(id: number) {
  const datos = await api<{ evento: EventoDetalle }>(`/events/${id}`, {
    mensajes: { 404: 'No encontramos ese evento' },
  });
  return datos.evento;
}

export async function listarCategorias() {
  const datos = await api<{ categorias: Categoria[] }>('/categories');
  return datos.categorias;
}
