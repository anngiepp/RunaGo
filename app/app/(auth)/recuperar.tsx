import { StyleSheet, Text } from 'react-native';
import { volver } from '@/lib/navegacion';
import { Button, Card, Insignia, Screen } from '@/components';
import { spacing, text } from '@/theme';

export default function RecuperarScreen() {
  return (
    <Screen fondo="crema" centrado anchoMaximo={480} bordes={['top', 'bottom']}>
      <Card destacada style={styles.card}>
        <Insignia texto="Próximamente" />
        <Text style={text.tituloLg}>Recuperar contraseña</Text>
        <Text style={text.cuerpo}>
          Esta función todavía no está disponible en esta versión de RunaGo.
        </Text>
        <Button titulo="Volver a iniciar sesión" variante="secundario" onPress={volver} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    gap: spacing.md,
  },
});
