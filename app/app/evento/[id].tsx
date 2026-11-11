import { ComponentProps, ReactNode, useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alerta, Button, Cargando, Insignia, PortadaEvento } from '@/components';
import { useEsMovil } from '@/hooks/useEsMovil';
import { ApiError } from '@/lib/api';
import { abrirComoLlegar } from '@/lib/comoLlegar';
import { fechaYHorario, iniciales, precioReferencial } from '@/lib/formato';
import { volver } from '@/lib/navegacion';
import { obtenerEvento } from '@/services/eventos';
import { colors, fonts, radius, shadows, spacing, text } from '@/theme';
import type { EventoDetalle } from '@/types';

type NombreIcono = ComponentProps<typeof Ionicons>['name'];

const ANCHO_WEB = 1120;

// La última palabra del título va en cursiva, como en los diseños
function Titulo({ titulo, esMovil }: { titulo: string; esMovil: boolean }) {
  const palabras = titulo.split(' ');
  const ultima = palabras.pop();
  return (
    <Text style={esMovil ? text.tituloLg : styles.tituloWeb}>
      {palabras.join(' ')} <Text style={text.acento}>{ultima}</Text>
    </Text>
  );
}

function Dato({
  icono,
  etiqueta,
  children,
}: {
  icono: NombreIcono;
  etiqueta: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.dato}>
      <View style={styles.iconoDato}>
        <Ionicons name={icono} size={18} color={colors.primario} />
      </View>
      <View style={styles.textoDato}>
        <Text style={styles.etiquetaDato}>{etiqueta}</Text>
        {children}
      </View>
    </View>
  );
}

function FilaTransporte({
  icono,
  titulo,
  detalle,
}: {
  icono: NombreIcono;
  titulo: string;
  detalle: string;
}) {
  return (
    <View style={styles.filaTransporte}>
      <Ionicons name={icono} size={18} color={colors.texto} />
      <View>
        <Text style={styles.tituloTransporte}>{titulo}</Text>
        <Text style={styles.detalleTransporte}>{detalle}</Text>
      </View>
    </View>
  );
}

function FichaTransporte({ evento }: { evento: EventoDetalle }) {
  const { paraderoCercano, servicioTransporte, minutosAPie } = evento.lugar;
  if (!paraderoCercano && !servicioTransporte && minutosAPie === null) {
    return null;
  }

  const resumen = [
    paraderoCercano,
    servicioTransporte,
    minutosAPie !== null ? `${minutosAPie} min a pie` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={styles.ficha} accessibilityLabel={`Cómo llegar en transporte público: ${resumen}`}>
      <Text style={styles.tituloFicha}>Cómo llegar · Transporte público</Text>
      <View style={styles.separadorFicha} />
      {paraderoCercano ? (
        <FilaTransporte
          icono="location-outline"
          titulo={paraderoCercano}
          detalle="Paradero más cercano"
        />
      ) : null}
      {servicioTransporte ? (
        <FilaTransporte icono="bus-outline" titulo={servicioTransporte} detalle="Servicio" />
      ) : null}
      {minutosAPie !== null ? (
        <FilaTransporte
          icono="walk-outline"
          titulo={`${minutosAPie} min a pie`}
          detalle="Caminata desde el paradero"
        />
      ) : null}
    </View>
  );
}

export default function DetalleEventoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const esMovil = useEsMovil();
  const [evento, setEvento] = useState<EventoDetalle>();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [noExiste, setNoExiste] = useState(false);
  const [errorMapa, setErrorMapa] = useState('');

  const cargar = useCallback(() => {
    return obtenerEvento(Number(id))
      .then((datos) => {
        setEvento(datos);
        setError('');
      })
      .catch((e: Error) => {
        setNoExiste(e instanceof ApiError && (e.status === 404 || e.status === 400));
        setError(e.message);
      })
      .finally(() => setCargando(false));
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  function reintentar() {
    setCargando(true);
    cargar();
  }

  async function comoLlegar() {
    if (!evento) return;
    setErrorMapa('');
    try {
      await abrirComoLlegar(evento.lugar);
    } catch (e) {
      setErrorMapa(e instanceof Error ? e.message : 'No pudimos abrir Google Maps.');
    }
  }

  if (cargando) {
    return <Cargando mensaje="Cargando evento..." />;
  }

  if (!evento) {
    return (
      <SafeAreaView style={styles.pantalla}>
        <View style={styles.estado}>
          <Ionicons
            name={noExiste ? 'search-outline' : 'cloud-offline-outline'}
            size={40}
            color={colors.primario}
          />
          <Text style={text.tituloMd}>
            {noExiste ? 'No encontramos ese evento' : 'No pudimos cargar el evento'}
          </Text>
          {!noExiste ? <Alerta mensaje={error} /> : null}
          {!noExiste ? <Button titulo="Reintentar" onPress={reintentar} /> : null}
          <Button titulo="Volver" variante="contorno" onPress={volver} />
        </View>
      </SafeAreaView>
    );
  }

  const botonComoLlegar = (
    <Button titulo="Cómo llegar" iconoDerecha="navigate-outline" onPress={comoLlegar} />
  );

  const datos = (
    <View style={styles.tarjetaDatos}>
      <Dato icono="calendar-outline" etiqueta="Fecha y horario">
        <Text style={styles.valorDato}>{fechaYHorario(evento.fechaInicio, evento.fechaFin)}</Text>
      </Dato>
      <View style={styles.separador} />
      <Dato icono="location-outline" etiqueta="Lugar">
        <Text style={styles.valorDato}>{evento.lugar.nombre}</Text>
        <Text style={text.cuerpoSm}>
          {evento.lugar.direccion}, {evento.lugar.distrito}
        </Text>
      </Dato>
      <View style={styles.separador} />
      <Dato icono="pricetag-outline" etiqueta="Ingreso">
        <Text style={styles.valorDato}>
          Precio referencial: {precioReferencial(evento.precioReferencia)}
        </Text>
        <Text style={text.cuerpoSm}>RunaGo no vende entradas. Consulta con el organizador.</Text>
      </Dato>
      <View style={styles.separador} />
      <View style={styles.dato}>
        <View style={[styles.iconoDato, styles.avatar]}>
          <Text style={styles.iniciales}>{iniciales(evento.organizador.nombre)}</Text>
        </View>
        <View style={styles.textoDato}>
          <Text style={styles.etiquetaDato}>Organiza</Text>
          <Text style={styles.valorDato}>{evento.organizador.nombre}</Text>
        </View>
      </View>
      {!esMovil ? (
        <View style={styles.accionWeb}>
          {errorMapa ? <Alerta mensaje={errorMapa} /> : null}
          {botonComoLlegar}
        </View>
      ) : null}
    </View>
  );

  const principal = (
    <View style={styles.columna}>
      <View>
        <PortadaEvento
          imagenUrl={evento.imagenUrl}
          categoria={evento.categoria.nombre}
          style={[styles.portada, esMovil ? styles.portadaMovil : styles.portadaWeb]}
        />
        <View style={styles.insignia}>
          <Insignia texto={evento.categoria.nombre} />
        </View>
        {esMovil ? (
          <Pressable
            onPress={volver}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            style={styles.botonVolver}
          >
            <Ionicons name="chevron-back" size={22} color={colors.texto} />
          </Pressable>
        ) : null}
      </View>

      <View style={[styles.cuerpo, !esMovil && styles.cuerpoWeb]}>
        <Titulo titulo={evento.titulo} esMovil={esMovil} />
        {evento.etiquetas.length > 0 ? (
          <View style={styles.etiquetas}>
            {evento.etiquetas.map((etiqueta) => (
              <View key={etiqueta} style={styles.etiqueta}>
                <Text style={styles.textoEtiqueta}>#{etiqueta}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {esMovil ? datos : null}

        <View style={styles.sobre}>
          <Text style={text.tituloMd}>
            Sobre el <Text style={text.acento}>evento</Text>
          </Text>
          <Text style={text.cuerpoLg}>{evento.descripcion}</Text>
        </View>

        {esMovil ? <FichaTransporte evento={evento} /> : null}
      </View>
    </View>
  );

  if (esMovil) {
    return (
      <SafeAreaView style={styles.pantalla} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollMovil}>{principal}</ScrollView>
        <View style={styles.barra}>
          {errorMapa ? <Alerta mensaje={errorMapa} /> : null}
          {botonComoLlegar}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.scrollWeb}>
        <View style={styles.contenedorWeb}>
          <Pressable onPress={volver} accessibilityRole="link" style={styles.migas}>
            <Ionicons name="arrow-back" size={16} color={colors.textoSuave} />
            <Text style={text.cuerpoSm}>
              Explorar / {evento.categoria.nombre} /{' '}
              <Text style={styles.migaActual}>{evento.titulo}</Text>
            </Text>
          </Pressable>
          <View style={styles.columnasWeb}>
            {principal}
            <View style={styles.lateral}>
              {datos}
              <FichaTransporte evento={evento} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  estado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  scrollMovil: {
    paddingBottom: spacing.lg,
  },
  scrollWeb: {
    padding: spacing.lg,
  },
  contenedorWeb: {
    width: '100%',
    maxWidth: ANCHO_WEB,
    alignSelf: 'center',
    gap: spacing.md,
  },
  migas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  migaActual: {
    color: colors.texto,
    fontFamily: fonts.semibold,
  },
  columnasWeb: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  columna: {
    flex: 1,
  },
  lateral: {
    width: 340,
    gap: spacing.md,
  },
  portada: {
    width: '100%',
  },
  portadaMovil: {
    height: 260,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  portadaWeb: {
    height: 340,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  insignia: {
    position: 'absolute',
    left: spacing.md,
    bottom: spacing.md,
  },
  botonVolver: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blanco,
    ...shadows.suave,
  },
  cuerpo: {
    padding: spacing.md,
    gap: spacing.md,
  },
  cuerpoWeb: {
    paddingHorizontal: 0,
    paddingTop: spacing.lg,
  },
  tituloWeb: {
    ...text.tituloXl,
    fontSize: 34,
    lineHeight: 40,
  },
  etiquetas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  etiqueta: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.blanco,
  },
  textoEtiqueta: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.texto,
  },
  tarjetaDatos: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.blanco,
    gap: spacing.md,
  },
  dato: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  iconoDato: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.crema,
  },
  avatar: {
    borderWidth: 1,
    borderColor: colors.borde,
  },
  iniciales: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primario,
  },
  textoDato: {
    flex: 1,
    gap: 2,
  },
  etiquetaDato: {
    ...text.cuerpoSm,
  },
  valorDato: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 21,
    color: colors.texto,
  },
  separador: {
    height: 1,
    backgroundColor: colors.bordeSuave,
  },
  accionWeb: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  sobre: {
    gap: spacing.sm,
  },
  ficha: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.turquesa,
    backgroundColor: colors.menta,
    gap: spacing.sm,
  },
  tituloFicha: {
    ...text.etiqueta,
    fontSize: 11,
  },
  separadorFicha: {
    height: 1,
    backgroundColor: 'rgba(34, 22, 20, 0.25)',
  },
  filaTransporte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tituloTransporte: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 19,
    color: colors.texto,
  },
  detalleTransporte: {
    ...text.cuerpoSm,
    color: colors.texto,
  },
  barra: {
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borde,
    backgroundColor: colors.blanco,
  },
});
