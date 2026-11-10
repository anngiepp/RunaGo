import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthLayout, Button, Insignia, Logo, MapaDecorativo } from '@/components';
import { useEsMovil } from '@/hooks/useEsMovil';
import { colors, fonts, radius, shadows, spacing, text } from '@/theme';

type NombreIcono = ComponentProps<typeof Ionicons>['name'];

const pasos: {
  numero: string;
  icono: NombreIcono;
  titulo: string;
  texto: string;
  fondo: string;
  colorNumero: string;
}[] = [
  {
    numero: '1',
    icono: 'compass-outline',
    titulo: 'Descubre',
    texto: 'Explora eventos y lugares en el mapa y encuentra los que van con tus intereses.',
    fondo: colors.mentaSuave,
    colorNumero: colors.texto,
  },
  {
    numero: '2',
    icono: 'bookmark-outline',
    titulo: 'Guarda',
    texto: 'Arma tu lista de favoritos para tener a la mano los planes que no te quieres perder.',
    fondo: colors.primario,
    colorNumero: colors.sobrePrimario,
  },
  {
    numero: '3',
    icono: 'bus-outline',
    titulo: 'Organiza tus planes',
    texto: 'Revisa cómo llegar en transporte público con un toque desde cada evento.',
    fondo: colors.crema,
    colorNumero: colors.texto,
  },
];

const irARegistro = () => router.push('/registro');
const irAOrganizador = () => router.push({ pathname: '/registro', params: { rol: 'ORGANIZADOR' } });
const irALogin = () => router.push('/login');

export default function BienvenidaScreen() {
  const esMovil = useEsMovil();

  if (esMovil) {
    return (
      <AuthLayout
        cabecera={
          <View style={styles.barraMovil}>
            <Logo tamano={24} />
          </View>
        }
      >
        <MapaDecorativo style={styles.mapaMovil} />
        <View style={styles.hoja}>
          <View style={styles.asa} />
          <View style={styles.chip}>
            <Ionicons name="sparkles-outline" size={14} color={colors.texto} />
            <Text style={styles.textoChip}>Cultura urbana viva en Lima</Text>
          </View>
          <Text style={styles.tituloMovil}>
            Encuentra qué hacer,{'\n'}
            <Text style={[text.acento, styles.resaltado]}> cerca de ti. </Text>
          </Text>
          <Text style={styles.introMovil}>
            Ferias locales, música acústica y planes culturales independientes reunidos en un mapa
            vivo.
          </Text>
          <View style={styles.botones}>
            <Button titulo="Crear cuenta" iconoDerecha="arrow-forward" onPress={irARegistro} />
            <Button titulo="Iniciar sesión" variante="contorno" onPress={irALogin} />
          </View>
          <Text style={styles.distritos}>Lima · Barranco · Miraflores · Centro</Text>
        </View>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      fondo="#FDFBF9"
      cabecera={
        <View style={styles.barraWeb}>
          <Logo tamano={22} />
          <View style={styles.accionesBarra}>
            <Text style={styles.enlaceBarra} onPress={irALogin}>
              Iniciar sesión
            </Text>
            <Button titulo="Soy organizador" onPress={irAOrganizador} style={styles.botonBarra} />
          </View>
        </View>
      }
    >
      <View style={styles.hero}>
        <View style={styles.heroTexto}>
          <Insignia texto="Radar vivo · Lima" />
          <Text style={styles.tituloWeb}>
            Encuentra qué hacer,{'\n'}
            <Text style={text.acento}>cerca de ti</Text>
          </Text>
          <Text style={styles.introWeb}>
            Descubre ferias de diseño autogestionadas, acústicos en azoteas secretas, cafetines de
            autor y rutas al aire libre en Lima. Cero filtros masivos, pura movida independiente.
          </Text>
          <View style={styles.filaBotones}>
            <Button titulo="Quiero descubrir" iconoDerecha="arrow-down" onPress={irARegistro} />
            <Button titulo="Soy organizador" variante="secundario" onPress={irAOrganizador} />
          </View>
          <View style={styles.fila}>
            <Text style={text.cuerpoSm}>¿Ya eres parte de la comunidad?</Text>
            <Text style={styles.enlaceSubrayado} onPress={irALogin}>
              Iniciar sesión
            </Text>
          </View>
        </View>
        <View style={[styles.mapaWeb, shadows.dura]}>
          <MapaDecorativo style={StyleSheet.absoluteFill} />
          <View style={styles.pastilla}>
            <Ionicons name="navigate-outline" size={14} color={colors.texto} />
            <Text style={styles.textoChip}>Explorando Lima</Text>
          </View>
        </View>
      </View>

      <View style={styles.seccion}>
        <Insignia texto="Tu brújula para la movida independiente" centrada />
        <Text style={[styles.tituloSeccion, styles.textoCentro]}>
          Cómo funciona <Text style={text.acento}>RunaGo</Text>
        </Text>
        <Text style={[styles.introWeb, styles.textoCentro, styles.introSeccion]}>
          Diseñado para quienes prefieren la tocada en el garaje antes que el festival masivo y el
          fanzine impreso antes que el algoritmo genérico.
        </Text>
        <View style={styles.pasos}>
          {pasos.map((paso) => (
            <View key={paso.numero} style={[styles.paso, shadows.duraSm]}>
              <View style={[styles.numero, { backgroundColor: paso.fondo }]}>
                <Text style={[styles.textoNumero, { color: paso.colorNumero }]}>{paso.numero}</Text>
              </View>
              <View style={styles.fila}>
                <Ionicons name={paso.icono} size={20} color={colors.texto} />
                <Text style={text.subtitulo}>{paso.titulo}</Text>
              </View>
              <Text style={styles.textoPaso}>{paso.texto}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.cta, shadows.duraSm]}>
        <Insignia texto="Únete al pulso independiente de Lima" centrada />
        <Text style={[styles.tituloSeccion, styles.textoCentro]}>
          ¿Listo para salir de la <Text style={text.acento}>rutina?</Text>
        </Text>
        <Text style={[styles.introWeb, styles.textoCentro, styles.introSeccion]}>
          No te pierdas lo que está pasando a la vuelta de tu esquina. Encuentra tocadas secretas,
          ferias autogestionadas y nuevas rutas hoy mismo.
        </Text>
        <View style={[styles.filaBotones, styles.centrado]}>
          <Button titulo="Quiero descubrir" iconoDerecha="arrow-forward" onPress={irARegistro} />
          <Button titulo="Publicar un evento" variante="contorno" onPress={irAOrganizador} />
        </View>
        <Text style={[text.cuerpoSm, styles.textoCentro]}>
          Completamente abierto para la comunidad cultural de Lima.
        </Text>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  barraMovil: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.blanco,
  },
  mapaMovil: {
    height: 300,
  },
  hoja: {
    marginTop: -spacing.lg,
    padding: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.md,
    borderTopLeftRadius: radius.lg * 1.5,
    borderTopRightRadius: radius.lg * 1.5,
    backgroundColor: colors.blanco,
    boxShadow: '0px -6px 20px rgba(34, 22, 20, 0.08)',
  },
  asa: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borde,
    marginBottom: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.menta,
    backgroundColor: colors.mentaSuave,
  },
  textoChip: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.texto,
  },
  tituloMovil: {
    ...text.tituloXl,
    fontSize: 28,
    lineHeight: 36,
  },
  resaltado: {
    backgroundColor: colors.mentaSuave,
    borderRadius: radius.sm,
  },
  introMovil: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textoMedio,
  },
  botones: {
    gap: spacing.sm + 4,
  },
  distritos: {
    ...text.cuerpoSm,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  barraWeb: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 4,
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.borde,
    backgroundColor: colors.blanco,
  },
  accionesBarra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  enlaceBarra: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.texto,
  },
  botonBarra: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  hero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xl * 1.5,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl * 1.5,
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
  },
  heroTexto: {
    flex: 1,
    minWidth: 340,
    gap: spacing.md + 4,
  },
  tituloWeb: {
    ...text.tituloXl,
    fontSize: 46,
    lineHeight: 52,
    letterSpacing: -1.4,
    color: '#503431',
  },
  introWeb: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 25,
    color: colors.textoMedio,
  },
  filaBotones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  enlaceSubrayado: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primario,
    textDecorationLine: 'underline',
  },
  mapaWeb: {
    flex: 1,
    minWidth: 340,
    height: 360,
    borderRadius: radius.lg * 1.5,
    borderWidth: 1,
    borderColor: colors.texto,
    overflow: 'hidden',
  },
  pastilla: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.blanco,
  },
  seccion: {
    gap: spacing.md + 4,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl * 1.5,
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
  },
  centrado: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCentro: {
    textAlign: 'center',
  },
  tituloSeccion: {
    ...text.tituloXl,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -1,
  },
  introSeccion: {
    maxWidth: 640,
    alignSelf: 'center',
  },
  pasos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  paso: {
    flex: 1,
    minWidth: 240,
    gap: spacing.sm + 4,
    padding: spacing.lg - 4,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.bordeInput,
    backgroundColor: colors.blanco,
  },
  numero: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.texto,
  },
  textoNumero: {
    fontFamily: fonts.titulo,
    fontSize: 16,
  },
  textoPaso: {
    ...text.cuerpo,
    color: colors.textoMedio,
  },
  cta: {
    gap: spacing.md + 4,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl * 1.5,
    padding: spacing.xl,
    borderRadius: radius.lg + 4,
    borderWidth: 1,
    borderColor: colors.bordeInput,
    backgroundColor: colors.crema,
    maxWidth: 1040,
    alignSelf: 'center',
    width: '92%',
  },
});
