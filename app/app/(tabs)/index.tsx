import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Alerta, Button, Card, Screen } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { abrirComoLlegar } from '@/lib/comoLlegar';
import { primerNombre } from '@/lib/formato';
import { spacing, text } from '@/theme';

// TEMPORAL (Sprint 1): lugar de prueba tomado de api/prisma/seed.ts.
// Se quita en el Sprint 2, cuando exista el endpoint de eventos.
const LUGAR_DE_PRUEBA = {
  nombre: 'Museo de Arte de Lima (MALI)',
  latitud: -12.0605,
  longitud: -77.0372,
};

export default function ExplorarScreen() {
  const { usuario } = useAuth();
  const [error, setError] = useState('');

  async function probarComoLlegar() {
    setError('');
    try {
      await abrirComoLlegar(LUGAR_DE_PRUEBA);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos abrir Google Maps.');
    }
  }

  return (
    <Screen>
      <Text style={text.etiqueta}>Hola, {primerNombre(usuario?.nombre ?? '')}</Text>
      <Text style={text.tituloXl}>
        ¿Qué hacemos <Text style={text.acento}>hoy</Text>?
      </Text>
      <Text style={text.cuerpo}>Aquí aparecerán los eventos y lugares cerca de ti.</Text>

      {/* TEMPORAL: botón de prueba de "Cómo llegar". Se quita en el Sprint 2. */}
      <Card fondo="crema" style={styles.prueba}>
        <Text style={text.etiqueta}>Prueba temporal</Text>
        <Text style={text.cuerpo}>
          Abre la ruta en transporte público hacia {LUGAR_DE_PRUEBA.nombre}.
        </Text>
        {error ? <Alerta mensaje={error} /> : null}
        <Button titulo="Cómo llegar" iconoDerecha="bus-outline" onPress={probarComoLlegar} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  prueba: {
    marginTop: spacing.lg,
  },
});
