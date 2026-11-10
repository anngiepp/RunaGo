import { ComponentProps, ReactNode, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, fonts, radius, shadows, spacing, text } from '@/theme';

type Props = TextInputProps & {
  etiqueta: string;
  error?: string;
  ayuda?: string;
  invalido?: boolean;
  icono?: ComponentProps<typeof Ionicons>['name'];
  contrasena?: boolean;
  extraEtiqueta?: ReactNode;
  etiquetaNormal?: boolean;
  relleno?: 'blanco' | 'suave';
};

export function Input({
  etiqueta,
  error,
  ayuda,
  invalido,
  icono,
  contrasena = false,
  extraEtiqueta,
  etiquetaNormal = false,
  relleno = 'blanco',
  style,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const [enfocado, setEnfocado] = useState(false);
  const [oculta, setOculta] = useState(true);
  const conError = Boolean(error) || invalido;

  return (
    <View style={styles.contenedor}>
      <View style={styles.filaEtiqueta}>
        <Text style={etiquetaNormal ? styles.etiquetaNormal : text.etiqueta}>{etiqueta}</Text>
        {extraEtiqueta}
      </View>
      <View
        style={[
          styles.campo,
          relleno === 'suave' && styles.suave,
          enfocado && styles.enfocado,
          enfocado && shadows.halo,
          conError && styles.conError,
        ]}
      >
        {icono ? <Ionicons name={icono} size={20} color={colors.textoSuave} /> : null}
        <TextInput
          {...props}
          accessibilityLabel={etiqueta}
          placeholderTextColor={colors.textoSuave}
          secureTextEntry={contrasena && oculta}
          onFocus={(e) => {
            setEnfocado(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setEnfocado(false);
            onBlur?.(e);
          }}
          style={[styles.input, style]}
        />
        {contrasena ? (
          <Pressable
            onPress={() => setOculta(!oculta)}
            accessibilityRole="button"
            accessibilityLabel={oculta ? 'Mostrar contraseña' : 'Ocultar contraseña'}
            hitSlop={8}
          >
            <Ionicons
              name={oculta ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={colors.textoSuave}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <View style={styles.filaError}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}
      {!error && ayuda ? <Text style={text.cuerpoSm}>{ayuda}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: spacing.sm,
  },
  filaEtiqueta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  etiquetaNormal: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.texto,
  },
  campo: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.bordeSuave,
    borderRadius: radius.md,
    backgroundColor: colors.blanco,
  },
  suave: {
    backgroundColor: colors.fondo,
    borderColor: colors.bordeInput,
  },
  input: {
    flex: 1,
    minHeight: 50,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.texto,
    ...(Platform.OS === 'web' ? { outlineWidth: 0, outlineColor: 'transparent' } : null),
  },
  enfocado: {
    borderWidth: 2,
    borderColor: colors.primario,
  },
  conError: {
    borderWidth: 2,
    borderColor: colors.error,
  },
  filaError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  error: {
    ...text.cuerpoSm,
    color: colors.error,
    flexShrink: 1,
  },
});
