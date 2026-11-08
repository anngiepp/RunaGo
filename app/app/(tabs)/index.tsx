import { Text } from 'react-native';
import { Screen } from '@/components';
import { fonts, text } from '@/theme';

export default function ExplorarScreen() {
  return (
    <Screen>
      <Text style={text.tituloXl}>
        ¿Qué hacemos <Text style={{ fontFamily: fonts.tituloCursiva }}>hoy</Text>?
      </Text>
      <Text style={text.cuerpo}>Aquí aparecerán los eventos y lugares cerca de ti.</Text>
    </Screen>
  );
}
