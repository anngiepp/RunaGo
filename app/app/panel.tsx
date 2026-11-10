// TEMPORAL: el panel de organizadores y administradores llega en otro sprint
import { StyleSheet, Text } from 'react-native';
import { Button, Card, Insignia, Logo, Screen } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { nombreRol, primerNombre } from '@/lib/formato';
import { spacing, text } from '@/theme';

export default function PanelScreen() {
  const { usuario, cerrarSesion } = useAuth();
  if (!usuario) return null;

  return (
    <Screen centrado anchoMaximo={480} bordes={['top', 'bottom']}>
      <Logo />
      <Card destacada style={styles.card}>
        <Insignia texto={nombreRol(usuario.rol)} />
        <Text style={text.tituloLg}>Hola, {primerNombre(usuario.nombre)}</Text>
        <Text style={text.subtitulo}>Panel en construcción</Text>
        <Text style={text.cuerpo}>
          Estamos preparando tu panel. Pronto podrás gestionar todo desde aquí.
        </Text>
        <Button titulo="Cerrar sesión" variante="secundario" onPress={cerrarSesion} />
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
