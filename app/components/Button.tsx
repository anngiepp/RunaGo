import { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEsMovil } from '@/hooks/useEsMovil';
import { colors, radius, shadows, spacing, text } from '@/theme';

type Variante = 'primario' | 'secundario' | 'contorno' | 'texto';

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
  const esMovil = useEsMovil();
  const inactivo = deshabilitado || cargando;
  const colorTexto =
    variante === 'primario'
      ? colors.sobrePrimario
      : variante === 'secundario'
        ? colors.texto
        : colors.primario;
  const conSombra = variante !== 'texto' && !inactivo;
  // En celular los diseños usan sombra suave; en web, la sombra dura del estilo indie
  const sombra = esMovil ? shadows.suave : shadows.duraSm;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo, busy: cargando }}
      style={({ pressed }) => [
        styles.base,
        !esMovil && styles.baseWeb,
        styles[variante],
        !esMovil && variante === 'primario' && styles.bordeOscuro,
        conSombra && !pressed && sombra,
        conSombra && pressed && styles.presionado,
        deshabilitado && styles.deshabilitado,
        style,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={colorTexto} />
      ) : (
        <>
          <Text style={[text.boton, !esMovil && styles.textoWeb, { color: colorTexto }]}>
            {titulo}
          </Text>
          {iconoDerecha ? <Ionicons name={iconoDerecha} size={18} color={colorTexto} /> : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 46,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  baseWeb: {
    minHeight: 42,
    paddingHorizontal: spacing.md + 4,
  },
  textoWeb: {
    fontSize: 14,
  },
  primario: {
    backgroundColor: colors.primario,
  },
  bordeOscuro: {
    borderWidth: 1.5,
    borderColor: colors.texto,
  },
  secundario: {
    backgroundColor: colors.menta,
    borderWidth: 1.5,
    borderColor: colors.texto,
  },
  contorno: {
    backgroundColor: colors.crema,
    borderWidth: 1,
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
