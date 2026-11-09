import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Alerta, Button, Card, Chip, Insignia, Screen } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { primerNombre } from '@/lib/formato';
import { guardarIntereses, listarIntereses } from '@/services/intereses';
import { colors, fonts, spacing, text } from '@/theme';
import type { Categoria } from '@/types';

const MINIMO = 3;

export default function InteresesScreen() {
  const { usuario, actualizarUsuario, cerrarSesion } = useAuth();
  const [intereses, setIntereses] = useState<Categoria[]>([]);
  const [elegidos, setElegidos] = useState<number[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState('');

  const cargar = useCallback(() => {
    return listarIntereses()
      .then((lista) => {
        setIntereses(lista);
        setErrorCarga('');
      })
      .catch((e: Error) => setErrorCarga(e.message))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  function reintentar() {
    setCargando(true);
    cargar();
  }

  function alternar(id: number) {
    setElegidos((actuales) =>
      actuales.includes(id) ? actuales.filter((x) => x !== id) : [...actuales, id],
    );
  }

  async function continuar() {
    setGuardando(true);
    setErrorGuardar('');
    try {
      actualizarUsuario(await guardarIntereses(elegidos));
    } catch (e) {
      setErrorGuardar(e instanceof Error ? e.message : 'No pudimos guardar tus intereses');
      setGuardando(false);
    }
  }

  const contador =
    elegidos.length < MINIMO
      ? `Llevas ${elegidos.length} de ${MINIMO}`
      : `¡Listo! Elegiste ${elegidos.length} intereses`;

  return (
    <Screen fondo="crema" centrado anchoMaximo={560} bordes={['top', 'bottom']}>
      <Card destacada style={styles.card}>
        <Insignia texto={`Hola, ${primerNombre(usuario?.nombre ?? '')}`} />
        <Text style={text.tituloLg}>
          ¿Qué te <Text style={{ fontFamily: fonts.tituloCursiva }}>mueve</Text>?
        </Text>
        <Text style={text.cuerpo}>
          Elige al menos {MINIMO} intereses para recomendarte eventos que vayan contigo.
        </Text>

        {cargando ? (
          <ActivityIndicator color={colors.primario} style={styles.cargando} />
        ) : errorCarga ? (
          <>
            <Alerta mensaje={errorCarga} />
            <Button titulo="Reintentar" variante="secundario" onPress={reintentar} />
          </>
        ) : (
          <>
            <View style={styles.chips}>
              {intereses.map((interes) => (
                <Chip
                  key={interes.id}
                  etiqueta={interes.nombre}
                  seleccionado={elegidos.includes(interes.id)}
                  onPress={() => alternar(interes.id)}
                />
              ))}
            </View>
            <Text style={[text.etiqueta, elegidos.length >= MINIMO && { color: colors.exito }]}>
              {contador}
            </Text>
            {errorGuardar ? <Alerta mensaje={errorGuardar} /> : null}
            <Button
              titulo="Continuar"
              iconoDerecha="arrow-forward"
              deshabilitado={elegidos.length < MINIMO}
              cargando={guardando}
              onPress={continuar}
            />
          </>
        )}
        <Button titulo="Cerrar sesión" variante="texto" onPress={cerrarSesion} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  cargando: {
    marginVertical: spacing.lg,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
