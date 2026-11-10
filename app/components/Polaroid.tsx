import { ComponentProps } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, fonts, radius, spacing } from '@/theme';

type Props = {
  icono: ComponentProps<typeof Ionicons>['name'];
  texto: string;
  fondo?: string;
  giro?: number;
  ancho?: number;
  style?: StyleProp<ViewStyle>;
};

// Foto instantánea ilustrada: en vez de fotos usa un ícono, para no inventar eventos
export function Polaroid({
  icono,
  texto,
  fondo = colors.menta,
  giro = 0,
  ancho = 150,
  style,
}: Props) {
  return (
    <View
      style={[styles.marco, { width: ancho, transform: [{ rotate: `${giro}deg` }] }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.cinta} />
      <View style={[styles.foto, { backgroundColor: fondo, height: ancho * 0.72 }]}>
        <Ionicons name={icono} size={ancho * 0.28} color={colors.texto} />
      </View>
      <Text style={styles.texto} numberOfLines={1}>
        {texto}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  marco: {
    padding: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.blanco,
    boxShadow: '0px 6px 16px rgba(34, 22, 20, 0.12)',
  },
  cinta: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    width: '45%',
    height: 18,
    backgroundColor: 'rgba(150, 193, 197, 0.65)',
    zIndex: 1,
  },
  foto: {
    borderRadius: radius.sm / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.texto,
    textAlign: 'center',
  },
});
