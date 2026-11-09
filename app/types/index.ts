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
