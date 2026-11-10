import { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEsMovil } from '@/hooks/useEsMovil';
import { colors, fonts, radius, shadows, spacing } from '@/theme';

type Props = {
  etiqueta: string;
  icono: ComponentProps<typeof Ionicons>['name'];
  seleccionada: boolean;
  onPress: () => void;
};

export function TarjetaSeleccionable({ etiqueta, icono, seleccionada, onPress }: Props) {
  const esMovil = useEsMovil();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: seleccionada }}
      style={[
        styles.tarjeta,
        !esMovil && styles.tarjetaWeb,
        seleccionada ? [styles.seleccionada, shadows.duraSm] : styles.normal,
      ]}
    >
      <Ionicons name={icono} size={18} color={colors.texto} />
      <Text style={styles.texto} numberOfLines={2}>
        {etiqueta}
      </Text>
      {seleccionada ? (
        <Ionicons name="checkmark-circle-outline" size={18} color={colors.texto} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexGrow: 1,
    flexBasis: '45%',
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  tarjetaWeb: {
    minHeight: 42,
  },
  normal: {
    backgroundColor: colors.blanco,
    borderColor: colors.borde,
    boxShadow: `2px 2px 0px ${colors.borde}`,
  },
  seleccionada: {
    backgroundColor: colors.menta,
    borderColor: colors.texto,
  },
  texto: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.texto,
  },
});
