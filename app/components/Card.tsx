import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme';

type Props = {
  children: ReactNode;
  destacada?: boolean;
  fondo?: 'blanco' | 'crema';
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, destacada = false, fondo = 'blanco', style }: Props) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors[fondo] },
        destacada && styles.destacada,
        destacada && shadows.dura,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borde,
    gap: spacing.sm,
  },
  destacada: {
    borderWidth: 1.5,
    borderColor: colors.texto,
  },
});
