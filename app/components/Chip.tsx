import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radius, spacing } from '@/theme';

type Props = {
  etiqueta: string;
  seleccionado?: boolean;
  onPress?: () => void;
};

export function Chip({ etiqueta, seleccionado = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: seleccionado }}
      style={[styles.chip, seleccionado && styles.seleccionado]}
    >
      <Text style={styles.texto}>{etiqueta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
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
