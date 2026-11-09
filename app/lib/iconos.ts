import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

type NombreIcono = ComponentProps<typeof Ionicons>['name'];

// Los intereses vienen de la API; si llega uno nuevo sin ícono, usa una etiqueta genérica
const iconosPorInteres: Record<string, NombreIcono> = {
  rock: 'musical-note-outline',
  indie: 'disc-outline',
  jazz: 'musical-notes-outline',
  electronica: 'options-outline',
  'hip hop': 'mic-outline',
  'arte urbano': 'color-palette-outline',
  gastronomia: 'restaurant-outline',
  teatro: 'happy-outline',
  cine: 'film-outline',
  ferias: 'storefront-outline',
  'cultura andina': 'sunny-outline',
  deporte: 'walk-outline',
  bienestar: 'leaf-outline',
  festivales: 'sparkles-outline',
  'cultura general': 'book-outline',
};

export function iconoDeInteres(nombre: string): NombreIcono {
  const clave = nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return iconosPorInteres[clave] ?? 'pricetag-outline';
}
