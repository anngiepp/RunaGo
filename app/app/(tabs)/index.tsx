import { Text } from 'react-native';
import { Screen } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { primerNombre } from '@/lib/formato';
import { text } from '@/theme';

export default function ExplorarScreen() {
  const { usuario } = useAuth();

  return (
    <Screen>
      <Text style={text.etiqueta}>Hola, {primerNombre(usuario?.nombre ?? '')}</Text>
      <Text style={text.tituloXl}>
        ¿Qué hacemos <Text style={text.acento}>hoy</Text>?
      </Text>
      <Text style={text.cuerpo}>Aquí aparecerán los eventos y lugares cerca de ti.</Text>
    </Screen>
  );
}
