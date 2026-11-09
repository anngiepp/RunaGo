import { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, fonts, radius, spacing, text } from '@/theme';

type Props = TextInputProps & {
  etiqueta: string;
  error?: string;
};

export function Input({ etiqueta, error, style, onFocus, onBlur, ...props }: Props) {
  const [enfocado, setEnfocado] = useState(false);

  return (
    <View style={styles.contenedor}>
      <Text style={text.etiqueta}>{etiqueta}</Text>
      <TextInput
        {...props}
        accessibilityLabel={etiqueta}
        placeholderTextColor={colors.textoSuave}
        onFocus={(e) => {
          setEnfocado(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setEnfocado(false);
          onBlur?.(e);
        }}
        style={[styles.input, enfocado && styles.enfocado, error && styles.conError, style]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: spacing.sm,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.bordeInput,
    borderRadius: radius.sm,
    backgroundColor: colors.blanco,
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
