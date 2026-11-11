import type { Rol } from '@/types';

const nombresRol: Record<Rol, string> = {
  EXPLORADOR: 'Explorador',
  ORGANIZADOR: 'Organizador',
  ADMIN: 'Administrador',
};

export function nombreRol(rol: Rol) {
  return nombresRol[rol];
}

export function primerNombre(nombre: string) {
  return nombre.trim().split(' ')[0];
}

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

// Las fechas se muestran en hora de Lima (UTC-5 todo el año), sin depender del celular
function enLima(fechaIso: string) {
  return new Date(new Date(fechaIso).getTime() - 5 * 60 * 60 * 1000);
}

function hora(fecha: Date) {
  const minutos = String(fecha.getUTCMinutes()).padStart(2, '0');
  return `${fecha.getUTCHours()}:${minutos}`;
}

// "Sáb 24 nov"
export function fechaCorta(fechaIso: string) {
  const fecha = enLima(fechaIso);
  const mes = MESES[fecha.getUTCMonth()].slice(0, 3);
  return `${DIAS[fecha.getUTCDay()]} ${fecha.getUTCDate()} ${mes}`;
}

// "Sáb 24 de noviembre · 20:00 – 23:00"
export function fechaYHorario(inicioIso: string, finIso: string | null) {
  const inicio = enLima(inicioIso);
  const dia = `${DIAS[inicio.getUTCDay()]} ${inicio.getUTCDate()} de ${MESES[inicio.getUTCMonth()]}`;
  const horas = finIso ? `${hora(inicio)} – ${hora(enLima(finIso))}` : hora(inicio);
  return `${dia} · ${horas}`;
}

export function precioReferencial(precio: number | null) {
  return precio ? `S/ ${precio}` : 'Libre';
}

export function iniciales(nombre: string) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0].toUpperCase())
    .join('');
}
