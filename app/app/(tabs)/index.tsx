import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Alerta, Button, Cargando, Chip, Screen, TarjetaEvento } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { useEsMovil } from '@/hooks/useEsMovil';
import { primerNombre } from '@/lib/formato';
import { iconoDeInteres } from '@/lib/iconos';
import { listarCategorias, listarEventos } from '@/services/eventos';
import { colors, spacing, text } from '@/theme';
import type { Categoria, Evento } from '@/types';

const ANCHO_WEB = 1120;

// Los chips empiezan por los intereses del usuario, como en el diseño
function primeroMisIntereses(categorias: Categoria[], idsIntereses: string) {
  const mios = idsIntereses.split(',').map(Number);
  return [...categorias].sort((a, b) => Number(mios.includes(b.id)) - Number(mios.includes(a.id)));
}

export default function ExplorarScreen() {
  const { usuario } = useAuth();
  const idsIntereses = usuario?.intereses.map((interes) => interes.id).join(',') ?? '';
  const esMovil = useEsMovil();
  const { width } = useWindowDimensions();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<number>();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [error, setError] = useState('');

  const cargar = useCallback((categoria?: number) => {
    return listarEventos({ categoriaId: categoria })
      .then((datos) => {
        setEventos(datos.eventos);
        setPagina(datos.pagina);
        setTotalPaginas(datos.totalPaginas);
        setTotal(datos.total);
        setError('');
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    cargar();
    // Si fallan las categorías, igual se ven los eventos (solo sin chips)
    listarCategorias()
      .then((lista) => setCategorias(primeroMisIntereses(lista, idsIntereses)))
      .catch(() => setCategorias([]));
  }, [cargar, idsIntereses]);

  function elegirCategoria(id?: number) {
    setCategoriaId(id);
    setEventos([]);
    setCargando(true);
    cargar(id);
  }

  function reintentar() {
    setCargando(true);
    cargar(categoriaId);
  }

  async function verMas() {
    setCargandoMas(true);
    try {
      const datos = await listarEventos({ categoriaId, pagina: pagina + 1 });
      setEventos((actuales) => [...actuales, ...datos.eventos]);
      setPagina(datos.pagina);
      setTotalPaginas(datos.totalPaginas);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos cargar más eventos');
    } finally {
      setCargandoMas(false);
    }
  }

  // En web las tarjetas van en 2 o 3 columnas
  const columnas = esMovil ? 1 : width >= 1080 ? 3 : 2;
  const anchoContenido = Math.min(width, ANCHO_WEB) - spacing.md * 2;
  const anchoTarjeta = (anchoContenido - spacing.md * (columnas - 1)) / columnas;
  const categoriaElegida = categorias.find((categoria) => categoria.id === categoriaId);

  return (
    <Screen anchoMaximo={esMovil ? undefined : ANCHO_WEB}>
      <View style={styles.saludo}>
        <View style={styles.punto} />
        <Text style={styles.hola}>Hola, {primerNombre(usuario?.nombre ?? '')}</Text>
      </View>
      <Text style={text.tituloXl}>
        ¿Qué hacemos <Text style={text.acento}>hoy</Text>?
      </Text>

      {categorias.length > 0 ? (
        // En celular los chips se deslizan; en web bajan a otra línea para que se vean todos
        <ScrollView
          horizontal={esMovil}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.chips, !esMovil && styles.chipsWeb]}
          style={esMovil && styles.filaChips}
        >
          <Chip
            etiqueta="Todos"
            icono="sparkles-outline"
            seleccionado={!categoriaId}
            onPress={() => elegirCategoria(undefined)}
          />
          {categorias.map((categoria) => (
            <Chip
              key={categoria.id}
              etiqueta={categoria.nombre}
              icono={iconoDeInteres(categoria.nombre)}
              seleccionado={categoria.id === categoriaId}
              onPress={() => elegirCategoria(categoria.id)}
            />
          ))}
        </ScrollView>
      ) : null}

      <View style={styles.encabezado}>
        <Text style={text.tituloMd}>
          {categoriaElegida ? categoriaElegida.nombre : 'Próximos eventos'}
        </Text>
        {!cargando && !error ? (
          <Text style={text.cuerpoSm}>
            {total} {total === 1 ? 'evento' : 'eventos'}
          </Text>
        ) : null}
      </View>

      {cargando ? (
        <View style={styles.estado}>
          <Cargando mensaje="Buscando eventos..." />
        </View>
      ) : error && eventos.length === 0 ? (
        <View style={styles.estado}>
          <Alerta mensaje={error} />
          <Button titulo="Reintentar" variante="contorno" onPress={reintentar} />
        </View>
      ) : eventos.length === 0 ? (
        <View style={[styles.estado, styles.vacio]}>
          <Ionicons name="calendar-clear-outline" size={40} color={colors.primario} />
          <Text style={text.subtitulo}>No hay eventos próximos aquí</Text>
          <Text style={[text.cuerpo, styles.centro]}>
            Prueba con otra categoría o vuelve más tarde.
          </Text>
          {categoriaId ? (
            <Button
              titulo="Ver todos los eventos"
              variante="contorno"
              onPress={() => elegirCategoria(undefined)}
            />
          ) : null}
        </View>
      ) : (
        <>
          <View style={styles.grilla}>
            {eventos.map((evento) => (
              <TarjetaEvento
                key={evento.id}
                evento={evento}
                style={{ width: esMovil ? '100%' : anchoTarjeta }}
                onPress={() => router.push(`/evento/${evento.id}`)}
              />
            ))}
          </View>
          {error ? <Alerta mensaje={error} /> : null}
          {pagina < totalPaginas ? (
            <Button
              titulo="Ver más eventos"
              variante="contorno"
              cargando={cargandoMas}
              onPress={verMas}
              style={styles.verMas}
            />
          ) : null}
        </>
      )}
    </Screen>
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
  hola: {
    ...text.cuerpo,
    color: colors.textoSuave,
  },
  filaChips: {
    marginHorizontal: -spacing.md,
    flexGrow: 0,
  },
  chips: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chipsWeb: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 0,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  estado: {
    minHeight: 220,
    justifyContent: 'center',
    gap: spacing.md,
  },
  vacio: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  centro: {
    textAlign: 'center',
    color: colors.textoSuave,
  },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  verMas: {
    alignSelf: 'center',
    minWidth: 220,
  },
});
