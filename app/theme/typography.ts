import { PlayfairDisplay_500Medium_Italic } from '@expo-google-fonts/playfair-display';
import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import type { TextStyle } from 'react-native';
import { colors } from './colors';

export const fuentesACargar = {
  PlayfairDisplay_500Medium_Italic,
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
};

// Como en los diseños de Stitch: títulos en Manrope ExtraBold y la palabra de acento en Playfair cursiva
export const fonts = {
  titulo: 'Manrope_800ExtraBold',
  tituloCursiva: 'PlayfairDisplay_500Medium_Italic',
  regular: 'Manrope_400Regular',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
} as const;

export const text = {
  tituloXl: {
    fontFamily: fonts.titulo,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.7,
    color: colors.texto,
  },
  tituloLg: {
    fontFamily: fonts.titulo,
    fontSize: 23,
    lineHeight: 29,
    letterSpacing: -0.4,
    color: colors.texto,
  },
  tituloMd: {
    fontFamily: fonts.titulo,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
    color: colors.texto,
  },
  acento: { fontFamily: fonts.tituloCursiva, color: colors.primario, letterSpacing: 0 },
  subtitulo: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: colors.texto },
  cuerpoLg: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.texto },
  cuerpo: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.texto },
  cuerpoSm: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.textoSuave },
  etiqueta: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.texto,
  },
  boton: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 20 },
} satisfies Record<string, TextStyle>;
