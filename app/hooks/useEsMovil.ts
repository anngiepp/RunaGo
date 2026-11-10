import { useWindowDimensions } from 'react-native';

// Por debajo de 768 px se usan los diseños MOV; desde ahí, los WEB
export const ANCHO_ESCRITORIO = 768;

export function useEsMovil() {
  const { width } = useWindowDimensions();
  return width < ANCHO_ESCRITORIO;
}

// Pantallas bajas (laptops de 768 px o celulares pequeños): se quitan adornos para que todo entre sin desplazarse
export function useEsCompacto() {
  const { width, height } = useWindowDimensions();
  return width < ANCHO_ESCRITORIO ? height < 720 : height < 820;
}
