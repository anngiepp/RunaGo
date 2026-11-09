import type { ViewStyle } from 'react-native';
import { colors } from './colors';

// Sombras duras sin desenfoque. boxShadow funciona en web y en Android 9+ (New Architecture)
export const shadows = {
  dura: { boxShadow: `3px 3px 0px ${colors.texto}` },
  duraSm: { boxShadow: `2px 2px 0px ${colors.texto}` },
} satisfies Record<string, ViewStyle>;
