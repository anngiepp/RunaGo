import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, spacing, text } from '@/theme';

type Props = {
  mensaje: string;
  tipo?: 'error' | 'exito';
};

export function Alerta({ mensaje, tipo = 'error' }: Props) {
  const color = tipo === 'error' ? colors.error : colors.exito;
  const fondo = tipo === 'error' ? colors.errorFondo : colors.exitoFondo;

  return (
    <View
      style={[styles.alerta, { borderColor: color, backgroundColor: fondo }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Ionicons
        name={tipo === 'error' ? 'alert-circle-outline' : 'checkmark-circle-outline'}
        size={20}
        color={color}
      />
      <Text style={[text.cuerpo, styles.texto, { color }]}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alerta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  texto: {
    flex: 1,
  },
});
