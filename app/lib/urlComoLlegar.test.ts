import { describe, expect, it } from 'vitest';
import { construirUrlComoLlegar, type Coordenadas } from './urlComoLlegar';

const mali = { latitud: -12.0605, longitud: -77.0372 };
const parqueKennedy = { latitud: -12.1211, longitud: -77.0296 };

describe('construirUrlComoLlegar', () => {
  it('arma la URL de transporte público sin origen', () => {
    expect(construirUrlComoLlegar(mali)).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=-12.0605,-77.0372&travelmode=transit',
    );
  });

  it('agrega el origen cuando se envía', () => {
    expect(construirUrlComoLlegar(mali, parqueKennedy)).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=-12.0605,-77.0372&travelmode=transit&origin=-12.1211,-77.0296',
    );
  });

  it('rechaza valores que no son números', () => {
    const conTexto = { latitud: '-12.06', longitud: -77.03 } as unknown as Coordenadas;
    expect(() => construirUrlComoLlegar(conTexto)).toThrow('destino no son válidas');
    expect(() => construirUrlComoLlegar({ latitud: NaN, longitud: -77.03 })).toThrow();
    expect(() => construirUrlComoLlegar({ latitud: -12.06, longitud: Infinity })).toThrow();
  });

  it('rechaza un origen inválido', () => {
    const origen = { latitud: null, longitud: -77.03 } as unknown as Coordenadas;
    expect(() => construirUrlComoLlegar(mali, origen)).toThrow('origen no son válidas');
  });

  it('rechaza coordenadas fuera de rango', () => {
    expect(() => construirUrlComoLlegar({ latitud: 95, longitud: -77.03 })).toThrow();
    expect(() => construirUrlComoLlegar({ latitud: -12.06, longitud: -190 })).toThrow();
  });
});
