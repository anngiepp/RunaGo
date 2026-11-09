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
import { colors, fonts, radius, spacing, text } from '@/theme';

type Props = TextInputProps & {
  etiqueta: string;
  error?: string;
  ayuda?: string;
  invalido?: boolean;
  icono?: ComponentProps<typeof Ionicons>['name'];
  contrasena?: boolean;
  extraEtiqueta?: ReactNode;
};

export function Input({
  etiqueta,
  error,
  ayuda,
  invalido,
  icono,
  contrasena = false,
  extraEtiqueta,
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
        <Text style={text.etiqueta}>{etiqueta}</Text>
        {extraEtiqueta}
      </View>
      <View style={[styles.campo, enfocado && styles.enfocado, conError && styles.conError]}>
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
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
  campo: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.bordeInput,
    borderRadius: radius.sm,
    backgroundColor: colors.blanco,
  },
  input: {
    flex: 1,
    minHeight: 46,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.texto,
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null),
  },
  enfocado: {
    borderWidth: 2,
    borderColor: colors.primario,
  },
  conError: {
    borderWidth: 2,
    borderColor: colors.error,
  },
  error: {
    ...text.cuerpoSm,
    color: colors.error,
  },
});
