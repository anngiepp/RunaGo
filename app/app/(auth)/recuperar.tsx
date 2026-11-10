import { StyleSheet, Text, View } from 'react-native';
import { AuthLayout, Button, Destello, Insignia } from '@/components';
import { useEsMovil } from '@/hooks/useEsMovil';
import { volver } from '@/lib/navegacion';
import { colors, fonts, radius, shadows, spacing, text } from '@/theme';

export default function RecuperarScreen() {
  const esMovil = useEsMovil();

  return (
    <AuthLayout onVolver={volver} fondo={esMovil ? colors.blanco : colors.crema}>
      <View style={[styles.contenido, !esMovil && styles.tarjeta, !esMovil && shadows.duraSm]}>
        <Destello style={styles.destello} />
        <Insignia texto="Próximamente" />
        <Text style={text.tituloXl}>
          Recuperar <Text style={text.acento}>contraseña</Text>
        </Text>
        <Text style={styles.intro}>
          Esta función todavía no está disponible en esta versión de RunaGo.
        </Text>
        <Button titulo="Volver a iniciar sesión" variante="contorno" onPress={volver} />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  contenido: {
    padding: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  tarjeta: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    marginVertical: spacing.xl * 2,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.bordeInput,
    backgroundColor: colors.blanco,
  },
  destello: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.lg,
  },
  intro: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textoMedio,
  },
});
