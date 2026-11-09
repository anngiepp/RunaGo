import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Card } from './Card';
import { Logo } from './Logo';
import { colors, spacing, text } from '@/theme';

const ANCHO_ESCRITORIO = 768;

type Props = {
  children: ReactNode;
  onVolver?: () => void;
  pie?: ReactNode;
  anchoMaximo?: number;
};

// En celular: pantalla blanca con barra superior (diseños MOV).
// En pantallas anchas: tarjeta centrada sobre fondo crema (diseños WEB).
export function AuthLayout({ children, onVolver, pie, anchoMaximo = 480 }: Props) {
  const { width } = useWindowDimensions();
  const escritorio = width >= ANCHO_ESCRITORIO;

  const volver = onVolver ? (
    <Pressable onPress={onVolver} accessibilityRole="button" style={styles.volver} hitSlop={8}>
      <Ionicons name="arrow-back" size={22} color={colors.texto} />
      <Text style={text.subtitulo}>Volver</Text>
    </Pressable>
  ) : null;

  if (escritorio) {
    return (
      <SafeAreaView style={[styles.pantalla, { backgroundColor: colors.crema }]}>
        <ScrollView
          contentContainerStyle={styles.scrollEscritorio}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.columna, { maxWidth: anchoMaximo }]}>
            <View style={styles.barraEscritorio}>
              {volver ?? <View />}
              <Logo />
            </View>
            <Card destacada style={styles.card}>
              {children}
              {pie}
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.pantalla, { backgroundColor: colors.blanco }]}
      edges={['top', 'bottom']}
    >
      <View style={styles.barra}>
        <View style={styles.lado}>{volver}</View>
        <Logo />
        <View style={styles.lado} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.contenido}>{children}</View>
      </ScrollView>
      {pie ? <View style={styles.pie}>{pie}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borde,
  },
  lado: {
    flex: 1,
  },
  volver: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
  },
  scroll: {
    flexGrow: 1,
  },
  contenido: {
    padding: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  pie: {
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borde,
    backgroundColor: colors.blanco,
  },
  scrollEscritorio: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  columna: {
    width: '100%',
    alignSelf: 'center',
    gap: spacing.md,
  },
  barraEscritorio: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    padding: spacing.lg,
    gap: spacing.md,
  },
});
