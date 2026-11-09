import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, text } from '@/theme';

export function Cargando({ mensaje }: { mensaje?: string }) {
  return (
    <View
      style={styles.contenedor}
      accessibilityRole="progressbar"
      accessibilityLabel={mensaje ?? 'Cargando'}
    >
      <ActivityIndicator size="large" color={colors.primario} />
      {mensaje ? <Text style={text.cuerpoSm}>{mensaje}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.fondo,
  },
});
