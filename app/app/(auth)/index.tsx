import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Insignia, Logo, Screen } from '@/components';
import { fonts, spacing, text } from '@/theme';

export default function BienvenidaScreen() {
  return (
    <Screen fondo="crema" centrado anchoMaximo={480} bordes={['top', 'bottom']}>
      <View style={styles.logo}>
        <Logo tamano={32} />
      </View>
      <Card destacada style={styles.card}>
        <Insignia texto="Cultura independiente · Perú" />
        <Text style={text.tituloXl}>
          Descubre la movida <Text style={{ fontFamily: fonts.tituloCursiva }}>independiente</Text>
        </Text>
        <Text style={text.cuerpoLg}>
          Encuentra eventos, lugares y experiencias cerca de ti, guárdalos en tu plan y llega en
          transporte público.
        </Text>
        <View style={styles.botones}>
          <Button
            titulo="Crear cuenta"
            iconoDerecha="arrow-forward"
            onPress={() => router.push('/registro')}
          />
          <Button
            titulo="Iniciar sesión"
            variante="secundario"
            onPress={() => router.push('/login')}
          />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  card: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  botones: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
});
