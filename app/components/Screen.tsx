import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors, layout, spacing } from '@/theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  bordes?: Edge[];
  fondo?: 'fondo' | 'crema' | 'blanco';
  anchoMaximo?: number;
  centrado?: boolean;
};

export function Screen({
  children,
  scroll = true,
  bordes = ['top'],
  fondo = 'fondo',
  anchoMaximo = layout.anchoMaximo,
  centrado = false,
}: Props) {
  const contenido = (
    <View style={[styles.contenido, { maxWidth: anchoMaximo }, !scroll && styles.lleno]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.pantalla, { backgroundColor: colors[fondo] }]} edges={bordes}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scroll, centrado && styles.centrado]}
          keyboardShouldPersistTaps="handled"
        >
          {contenido}
        </ScrollView>
      ) : (
        contenido
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  centrado: {
    justifyContent: 'center',
  },
  contenido: {
    width: '100%',
    alignSelf: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  lleno: {
    flex: 1,
  },
});
