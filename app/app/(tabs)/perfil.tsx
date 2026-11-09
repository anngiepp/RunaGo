import { Text } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Screen } from '@/components';
import { text } from '@/theme';

export default function PerfilScreen() {
  return (
    <Screen>
      <Text style={text.tituloLg}>Perfil</Text>
      <Text style={text.cuerpo}>Aquí verás tu cuenta, tus intereses y tu membresía.</Text>

      {/* TEMPORAL: acceso a la vitrina de componentes. Quitar antes de producción */}
      <Card fondo="crema">
        <Text style={text.etiqueta}>Solo para desarrollo</Text>
        <Text style={text.cuerpoSm}>Revisa cómo se ven los componentes y las tipografías.</Text>
        <Button
          titulo="Ver componentes (temporal)"
          variante="secundario"
          onPress={() => router.push('/componentes')}
        />
      </Card>
    </Screen>
  );
}
