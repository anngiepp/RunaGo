import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, spacing, text } from '@/theme';

type Props = {
  etiqueta: string;
  marcado: boolean;
  onCambiar: (marcado: boolean) => void;
};

export function Checkbox({ etiqueta, marcado, onCambiar }: Props) {
  return (
    <Pressable
      onPress={() => onCambiar(!marcado)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: marcado }}
      style={styles.fila}
    >
      <View style={[styles.caja, marcado && styles.marcada]}>
        {marcado ? <Ionicons name="checkmark" size={16} color={colors.sobrePrimario} /> : null}
      </View>
      <Text style={[text.cuerpo, styles.texto]}>{etiqueta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  caja: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.texto,
    backgroundColor: colors.blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marcada: {
    backgroundColor: colors.primario,
    borderColor: colors.primario,
  },
  texto: {
    flexShrink: 1,
  },
});
