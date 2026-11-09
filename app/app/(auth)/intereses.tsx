import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Alerta, AuthLayout, Button, Chip, TarjetaSeleccionable } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { primerNombre } from '@/lib/formato';
import { iconoDeInteres } from '@/lib/iconos';
import { guardarIntereses, listarIntereses } from '@/services/intereses';
import { colors, fonts, radius, spacing, text } from '@/theme';
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

  const faltan = MINIMO - elegidos.length;
  const listo = faltan <= 0;
  const elegidosConNombre = intereses.filter((interes) => elegidos.includes(interes.id));

  const pie =
    cargando || errorCarga ? null : (
      <View style={styles.pie}>
        {errorGuardar ? <Alerta mensaje={errorGuardar} /> : null}
        <Text style={[styles.mensaje, listo && styles.mensajeListo]}>
          {listo
            ? '¡Listo! Ya podemos recomendarte planes'
            : `Elige al menos ${faltan} más para continuar`}
        </Text>
        <Button
          titulo="Continuar"
          iconoDerecha="arrow-forward"
          deshabilitado={!listo}
          cargando={guardando}
          onPress={continuar}
        />
      </View>
    );

  return (
    <AuthLayout pie={pie} anchoMaximo={600}>
      <View style={styles.saludo}>
        <View style={styles.punto} />
        <Text style={styles.textoSaludo}>¡Hola, {primerNombre(usuario?.nombre ?? '')}! ✦</Text>
      </View>
      <View>
        <Text style={text.tituloXl}>
          ¿Qué te <Text style={styles.cursiva}>mueve?</Text>
        </Text>
        <Text style={text.cuerpo}>
          Elige al menos {MINIMO} para recomendarte eventos acordes a tu vibra.
        </Text>
      </View>

      {cargando ? (
        <ActivityIndicator color={colors.primario} style={styles.cargando} />
      ) : errorCarga ? (
        <>
          <Alerta mensaje={errorCarga} />
          <Button titulo="Reintentar" variante="contorno" onPress={reintentar} />
        </>
      ) : (
        <>
          <View style={styles.resumen}>
            <View style={styles.filaResumen}>
              <Ionicons name="radio-outline" size={18} color={colors.primario} />
              <Text style={[text.subtitulo, styles.tituloResumen]}>Tus intereses en el radar</Text>
              <Text style={styles.contador}>
                {listo ? `${elegidos.length} elegidos` : `${elegidos.length} de ${MINIMO} (mínimo)`}
              </Text>
            </View>
            <View style={styles.barra}>
              <View
                style={[
                  styles.progreso,
                  { width: `${Math.min(elegidos.length / MINIMO, 1) * 100}%` },
                ]}
              />
            </View>
            {elegidosConNombre.length > 0 ? (
              <View style={styles.chips}>
                {elegidosConNombre.map((interes) => (
                  <Chip
                    key={interes.id}
                    etiqueta={interes.nombre}
                    seleccionado
                    onPress={() => alternar(interes.id)}
                  />
                ))}
              </View>
            ) : (
              <Text style={text.cuerpoSm}>Aún no eliges ninguno.</Text>
            )}
          </View>

          <View style={styles.grilla}>
            {intereses.map((interes) => (
              <TarjetaSeleccionable
                key={interes.id}
                etiqueta={interes.nombre}
                icono={iconoDeInteres(interes.nombre)}
                seleccionada={elegidos.includes(interes.id)}
                onPress={() => alternar(interes.id)}
              />
            ))}
          </View>
        </>
      )}

      <Button titulo="Cerrar sesión" variante="texto" onPress={cerrarSesion} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  saludo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  punto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.menta,
  },
  textoSaludo: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primario,
  },
  cursiva: {
    fontFamily: fonts.tituloCursiva,
    color: colors.primario,
  },
  cargando: {
    marginVertical: spacing.lg,
  },
  resumen: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.crema,
  },
  filaResumen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tituloResumen: {
    flex: 1,
    fontSize: 14,
  },
  contador: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primario,
  },
  barra: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.blanco,
    overflow: 'hidden',
  },
  progreso: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.menta,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pie: {
    gap: spacing.sm,
  },
  mensaje: {
    ...text.cuerpo,
    fontFamily: fonts.semibold,
    textAlign: 'center',
  },
  mensajeListo: {
    color: colors.primario,
  },
});
