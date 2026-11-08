import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors, layout, spacing } from '@/theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  bordes?: Edge[];
};

export function Screen({ children, scroll = true, bordes = ['top'] }: Props) {
  return (
    <SafeAreaView style={styles.fondo} edges={bordes}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.contenido}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[styles.contenido, styles.lleno]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  scroll: {
    flexGrow: 1,
  },
  contenido: {
    width: '100%',
    maxWidth: layout.anchoMaximo,
    alignSelf: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  lleno: {
    flex: 1,
  },
});
