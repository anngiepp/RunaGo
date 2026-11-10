import type { ViewStyle } from 'react-native';
import { colors } from './colors';

// Sombras duras sin desenfoque. boxShadow funciona en web y en Android 9+ (New Architecture)
export const shadows = {
  dura: { boxShadow: `3px 3px 0px ${colors.texto}` },
  duraSm: { boxShadow: `2px 2px 0px ${colors.texto}` },
  suave: { boxShadow: '0px 4px 16px rgba(105, 74, 71, 0.18)' },
  halo: { boxShadow: `0px 0px 0px 4px ${colors.mentaSuave}` },
} satisfies Record<string, ViewStyle>;
