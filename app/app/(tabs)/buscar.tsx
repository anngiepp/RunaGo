import { Text } from 'react-native';
import { Screen } from '@/components';
import { text } from '@/theme';

export default function BuscarScreen() {
  return (
    <Screen>
      <Text style={text.tituloLg}>Buscar</Text>
      <Text style={text.cuerpo}>Aquí podrás buscar eventos por nombre, categoría o distrito.</Text>
    </Screen>
  );
}
