import { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, shadows, spacing, text } from '@/theme';

type Variante = 'primario' | 'secundario' | 'texto';

type Props = {
  titulo: string;
  onPress?: () => void;
  variante?: Variante;
  cargando?: boolean;
  deshabilitado?: boolean;
  iconoDerecha?: ComponentProps<typeof Ionicons>['name'];
  style?: StyleProp<ViewStyle>;
};

export function Button({
  titulo,
  onPress,
  variante = 'primario',
  cargando = false,
  deshabilitado = false,
  iconoDerecha,
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
        <>
          <Text style={[text.boton, { color: colorTexto }]}>{titulo}</Text>
          {iconoDerecha ? <Ionicons name={iconoDerecha} size={18} color={colorTexto} /> : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
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
