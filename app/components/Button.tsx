import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing, text } from '@/theme';

type Variante = 'primario' | 'secundario' | 'texto';

type Props = {
  titulo: string;
  onPress?: () => void;
  variante?: Variante;
  cargando?: boolean;
  deshabilitado?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  titulo,
  onPress,
  variante = 'primario',
  cargando = false,
  deshabilitado = false,
  style,
}: Props) {
  const inactivo = deshabilitado || cargando;
  const colorTexto =
    variante === 'primario'
      ? colors.sobrePrimario
      : variante === 'secundario'
        ? colors.texto
        : colors.primario;
  const conSombra = variante !== 'texto' && !inactivo;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo, busy: cargando }}
      style={({ pressed }) => [
        styles.base,
        styles[variante],
        conSombra && !pressed && shadows.duraSm,
        conSombra && pressed && styles.presionado,
        deshabilitado && styles.deshabilitado,
        style,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={colorTexto} />
      ) : (
        <Text style={[text.boton, { color: colorTexto }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: {
    backgroundColor: colors.primario,
    borderWidth: 1.5,
    borderColor: colors.texto,
  },
  secundario: {
    backgroundColor: colors.menta,
    borderWidth: 1.5,
    borderColor: colors.texto,
  },
  texto: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.sm,
  },
  presionado: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  deshabilitado: {
    opacity: 0.45,
  },
});
