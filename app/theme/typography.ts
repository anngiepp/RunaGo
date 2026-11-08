import {
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';
import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import type { TextStyle } from 'react-native';
import { colors } from './colors';

export const fuentesACargar = {
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
};

export const fonts = {
  titulo: 'PlayfairDisplay_700Bold',
  tituloCursiva: 'PlayfairDisplay_700Bold_Italic',
  regular: 'Manrope_400Regular',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
} as const;

export const text = {
  tituloXl: { fontFamily: fonts.titulo, fontSize: 38, lineHeight: 44, color: colors.texto },
  tituloLg: { fontFamily: fonts.titulo, fontSize: 28, lineHeight: 34, color: colors.texto },
  tituloMd: { fontFamily: fonts.titulo, fontSize: 22, lineHeight: 28, color: colors.texto },
  subtitulo: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 24, color: colors.texto },
  cuerpoLg: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 26, color: colors.texto },
  cuerpo: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.texto },
  cuerpoSm: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.textoSuave },
  etiqueta: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.texto,
  },
  boton: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20 },
} satisfies Record<string, TextStyle>;
