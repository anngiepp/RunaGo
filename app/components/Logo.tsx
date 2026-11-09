import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme';

export function Logo({ tamano = 26 }: { tamano?: number }) {
  return (
    <View style={styles.fila} accessibilityRole="header" accessibilityLabel="RunaGo">
      <Text style={[styles.texto, { fontSize: tamano, lineHeight: tamano * 1.2 }]}>RunaGo</Text>
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
    fontFamily: fonts.bold,
    color: colors.texto,
    letterSpacing: -0.5,
  },
  punto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.texto,
    backgroundColor: colors.menta,
  },
});
