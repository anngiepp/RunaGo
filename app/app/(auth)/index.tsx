import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AuthLayout, Button, Insignia } from '@/components';
import { colors, fonts, radius, spacing, text } from '@/theme';

export default function BienvenidaScreen() {
  return (
    <AuthLayout>
      <View style={styles.contenido}>
        <Insignia texto="Cultura independiente · Perú" />
        <Text style={text.tituloXl}>
          Encuentra qué hacer, <Text style={styles.resaltado}>cerca de ti.</Text>
        </Text>
        <Text style={text.cuerpoLg}>
          Eventos, lugares y experiencias de la movida independiente, con cómo llegar en transporte
          público.
        </Text>
        <View style={styles.botones}>
          <Button
            titulo="Crear cuenta"
            iconoDerecha="arrow-forward"
            onPress={() => router.push('/registro')}
          />
          <Button
            titulo="Iniciar sesión"
            variante="contorno"
            onPress={() => router.push('/login')}
          />
        </View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  contenido: {
    gap: spacing.md,
  },
  resaltado: {
    fontFamily: fonts.tituloCursiva,
    color: colors.primario,
    backgroundColor: colors.menta,
    borderRadius: radius.sm,
  },
  botones: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
});
