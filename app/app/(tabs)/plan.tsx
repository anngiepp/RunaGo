import { Text } from 'react-native';
import { Screen } from '@/components';
import { text } from '@/theme';

export default function PlanScreen() {
  return (
    <Screen>
      <Text style={text.tituloLg}>Mi plan</Text>
      <Text style={text.cuerpo}>Aquí verás los eventos que guardaste en favoritos.</Text>
    </Screen>
  );
}
