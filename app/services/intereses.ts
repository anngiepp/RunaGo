import { api } from '@/lib/api';
import type { Categoria, Usuario } from '@/types';

// Los intereses son las categorías de la API
export async function listarIntereses() {
  const datos = await api<{ categorias: Categoria[] }>('/categorias');
  return datos.categorias;
}

export async function guardarIntereses(categoriaIds: number[]) {
  const datos = await api<{ usuario: Usuario }>('/me/intereses', {
    method: 'PUT',
    body: { categoriaIds },
  });
  return datos.usuario;
}
