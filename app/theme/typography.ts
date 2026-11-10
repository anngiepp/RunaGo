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
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.8,
    color: colors.texto,
  },
  tituloLg: {
    fontFamily: fonts.titulo,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: colors.texto,
  },
  tituloMd: {
    fontFamily: fonts.titulo,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
    color: colors.texto,
  },
  acento: { fontFamily: fonts.tituloCursiva, color: colors.primario, letterSpacing: 0 },
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
