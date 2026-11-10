import { Linking, Platform } from 'react-native';
import { construirUrlComoLlegar, type Coordenadas } from './urlComoLlegar';

export { construirUrlComoLlegar, type Coordenadas };

const MENSAJE_ERROR = 'No pudimos abrir Google Maps. Inténtalo de nuevo.';

// Abre Google Maps con la ruta en transporte público. Si falla, lanza un error con un mensaje en español.
export async function abrirComoLlegar(destino: Coordenadas, origen?: Coordenadas) {
  const url = construirUrlComoLlegar(destino, origen);

  if (Platform.OS === 'web') {
    const pestana = window.open(url, '_blank');
    if (!pestana) {
      throw new Error('Tu navegador bloqueó la pestaña nueva. Permite las ventanas emergentes.');
    }
    pestana.opener = null;
    return;
  }

  try {
    await Linking.openURL(url);
  } catch {
    throw new Error(MENSAJE_ERROR);
  }
}
