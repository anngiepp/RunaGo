import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme';

export function Logo({ tamano = 24, color = colors.texto }: { tamano?: number; color?: string }) {
  return (
    <View style={styles.fila} accessibilityRole="header" accessibilityLabel="RunaGo">
      <Text style={[styles.texto, { fontSize: tamano, lineHeight: tamano * 1.2, color }]}>
        RunaGo
      </Text>
      <View style={styles.punto} />
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  texto: {
    fontFamily: fonts.titulo,
    letterSpacing: -0.5,
  },
  punto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.menta,
  },
});
