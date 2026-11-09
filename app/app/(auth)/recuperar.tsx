import { Text } from 'react-native';
import { AuthLayout, Button, Insignia } from '@/components';
import { volver } from '@/lib/navegacion';
import { text } from '@/theme';

export default function RecuperarScreen() {
  return (
    <AuthLayout onVolver={volver}>
      <Insignia texto="Próximamente" />
      <Text style={text.tituloLg}>Recuperar contraseña</Text>
      <Text style={text.cuerpo}>
        Esta función todavía no está disponible en esta versión de RunaGo.
      </Text>
      <Button titulo="Volver a iniciar sesión" variante="contorno" onPress={volver} />
    </AuthLayout>
  );
}
