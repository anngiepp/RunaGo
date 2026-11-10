import { StyleSheet, Text, View } from 'react-native';
import { Logo } from './Logo';
import { colors, spacing, text } from '@/theme';

export function PieWeb() {
  return (
    <View style={styles.pie}>
      <View style={styles.izquierda}>
        <Logo tamano={18} />
        <Text style={text.cuerpoSm}>
          © {new Date().getFullYear()} RunaGo. Hecho con pulso independiente en Lima, Perú.
        </Text>
      </View>
      <Text style={text.cuerpoSm}>Sonido crudo · Cultura viva · Espacios libres</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pie: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.borde,
    backgroundColor: '#F4EEE8',
  },
  izquierda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
});
