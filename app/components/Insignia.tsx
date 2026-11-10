import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, text } from '@/theme';

export function Insignia({ texto, centrada = false }: { texto: string; centrada?: boolean }) {
  return (
    <View style={[styles.insignia, centrada && styles.centrada]}>
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  insignia: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.texto,
    backgroundColor: colors.crema,
  },
  centrada: {
    alignSelf: 'center',
  },
  texto: {
    ...text.etiqueta,
    fontSize: 11,
  },
});
