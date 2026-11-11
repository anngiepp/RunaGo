export type Punto = { latitud: number; longitud: number };

const RADIO_TIERRA_KM = 6371;

function aRadianes(grados: number) {
  return (grados * Math.PI) / 180;
}

// Distancia en línea recta entre dos puntos (fórmula de Haversine)
export function distanciaKm(a: Punto, b: Punto) {
  const dLat = aRadianes(b.latitud - a.latitud);
  const dLng = aRadianes(b.longitud - a.longitud);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(a.latitud)) * Math.cos(aRadianes(b.latitud)) * Math.sin(dLng / 2) ** 2;
  return 2 * RADIO_TIERRA_KM * Math.asin(Math.sqrt(h));
}

export function redondear(valor: number, decimales = 2) {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
}
