import { useWindowDimensions } from 'react-native';

// Por debajo de 768 px se usan los diseños MOV; desde ahí, los WEB
export const ANCHO_ESCRITORIO = 768;

export function useEsMovil() {
  const { width } = useWindowDimensions();
  return width < ANCHO_ESCRITORIO;
}
