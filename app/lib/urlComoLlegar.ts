export type Coordenadas = {
  latitud: number;
  longitud: number;
};

const URL_BASE = 'https://www.google.com/maps/dir/?api=1';

function esCoordenadaValida({ latitud, longitud }: Coordenadas) {
  return (
    typeof latitud === 'number' &&
    typeof longitud === 'number' &&
    Number.isFinite(latitud) &&
    Number.isFinite(longitud) &&
    Math.abs(latitud) <= 90 &&
    Math.abs(longitud) <= 180
  );
}

export function construirUrlComoLlegar(destino: Coordenadas, origen?: Coordenadas) {
  if (!esCoordenadaValida(destino)) {
    throw new Error('Las coordenadas del destino no son válidas.');
  }
  if (origen && !esCoordenadaValida(origen)) {
    throw new Error('Las coordenadas de origen no son válidas.');
  }

  let url = `${URL_BASE}&destination=${destino.latitud},${destino.longitud}&travelmode=transit`;
  // Sin origen, Google Maps usa la ubicación actual del usuario
  if (origen) {
    url += `&origin=${origen.latitud},${origen.longitud}`;
  }
  return url;
}
