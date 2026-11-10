import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Logo } from './Logo';
import { PieWeb } from './PieWeb';
import { useEsMovil } from '@/hooks/useEsMovil';
import { colors, spacing, text } from '@/theme';

type Props = {
  children: ReactNode;
  onVolver?: () => void;
  pie?: ReactNode;
  fondo?: string;
  cabecera?: ReactNode;
};

// Marco de las pantallas de acceso: barra superior, contenido y, en web, el pie de página
export function AuthLayout({ children, onVolver, pie, fondo = colors.blanco, cabecera }: Props) {
  const esMovil = useEsMovil();

  const volver = onVolver ? (
    <Pressable onPress={onVolver} accessibilityRole="button" style={styles.volver} hitSlop={8}>
      <View style={!esMovil && styles.circulo}>
        <Ionicons name="arrow-back" size={esMovil ? 22 : 18} color={colors.texto} />
      </View>
      <Text style={[text.subtitulo, styles.textoVolver]}>Volver</Text>
    </Pressable>
  ) : null;

  const barra = cabecera ?? (
    <View style={[styles.barra, !esMovil && styles.barraEscritorio]}>
      <View style={styles.lado}>{volver}</View>
      <Logo tamano={esMovil ? 22 : 26} />
      <View style={styles.lado} />
    </View>
  );

  return (
    <SafeAreaView style={[styles.pantalla, { backgroundColor: fondo }]} edges={['top', 'bottom']}>
      {barra}
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.contenido}>{children}</View>
        {esMovil ? null : <PieWeb />}
      </ScrollView>
      {pie && esMovil ? <View style={styles.pie}>{pie}</View> : null}
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
    backgroundColor: colors.blanco,
  },
  barraEscritorio: {
    paddingHorizontal: spacing.xl,
    minHeight: 72,
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
  circulo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.crema,
  },
  textoVolver: {
    fontSize: 15,
  },
  scroll: {
    flexGrow: 1,
  },
  contenido: {
    flex: 1,
  },
  pie: {
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borde,
    backgroundColor: colors.blanco,
  },
});
