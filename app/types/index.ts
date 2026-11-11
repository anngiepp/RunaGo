export type Rol = 'EXPLORADOR' | 'ORGANIZADOR' | 'ADMIN';

export type Categoria = {
  id: number;
  nombre: string;
};

export type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
  creadoEn: string;
  intereses: Categoria[];
};

export type LugarEvento = {
  id: number;
  nombre: string;
  direccion: string;
  distrito: string;
  latitud: number;
  longitud: number;
  paraderoCercano: string | null;
  servicioTransporte: string | null;
  minutosAPie: number | null;
};

export type Evento = {
  id: number;
  titulo: string;
  descripcion: string;
  etiquetas: string[];
  fechaInicio: string;
  fechaFin: string | null;
  latitud: number;
  longitud: number;
  imagenUrl: string | null;
  precioReferencia: number | null;
  categoria: Categoria;
  lugar: LugarEvento;
  organizador: { nombre: string };
  esFavorito?: boolean;
};

export type EventoDetalle = Evento & {
  resenas: { promedio: number | null; total: number };
};

export type PaginaEventos = {
  eventos: Evento[];
  pagina: number;
  porPagina: number;
  total: number;
  totalPaginas: number;
};
