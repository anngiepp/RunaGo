import { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, fonts, radius, spacing } from '@/theme';

type Props = {
  etiqueta: string;
  seleccionado?: boolean;
  onPress?: () => void;
  icono?: ComponentProps<typeof Ionicons>['name'];
};

export function Chip({ etiqueta, seleccionado = false, onPress, icono }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: seleccionado }}
      style={[styles.chip, seleccionado && styles.seleccionado]}
    >
      {icono ? <Ionicons name={icono} size={16} color={colors.texto} /> : null}
      <Text style={styles.texto}>{etiqueta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.fondo,
  },
  seleccionado: {
    backgroundColor: colors.menta,
    borderWidth: 1.5,
    borderColor: colors.texto,
  },
  texto: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.texto,
  },
});
