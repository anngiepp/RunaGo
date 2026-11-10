import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Alerta,
  AuthLayout,
  Button,
  Checkbox,
  Destello,
  Input,
  Insignia,
  Polaroid,
} from '@/components';
import { useAuth } from '@/context/AuthContext';
import { useEsMovil } from '@/hooks/useEsMovil';
import { ApiError } from '@/lib/api';
import { volver } from '@/lib/navegacion';
import { colors, fonts, radius, shadows, spacing, text } from '@/theme';

export default function LoginScreen() {
  const esMovil = useEsMovil();
  const { iniciarSesion } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [recordar, setRecordar] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [credencialesMalas, setCredencialesMalas] = useState(false);
  const [faltantes, setFaltantes] = useState({ correo: '', contrasena: '' });

  function cambiar(campo: 'correo' | 'contrasena', valor: string, setter: (v: string) => void) {
    setter(valor);
    setFaltantes((actuales) => ({ ...actuales, [campo]: '' }));
    setCredencialesMalas(false);
  }

  async function entrar() {
    const vacios = {
      correo: correo.trim() ? '' : 'Ingresa tu correo',
      contrasena: contrasena ? '' : 'Ingresa tu contraseña',
    };
    setFaltantes(vacios);
    setError('');
    setCredencialesMalas(false);
    if (vacios.correo || vacios.contrasena) return;

    setCargando(true);
    try {
      await iniciarSesion(correo.trim(), contrasena, recordar);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado');
      setCredencialesMalas(e instanceof ApiError && e.status === 401);
      setCargando(false);
    }
  }

  const formulario = (
    <View style={styles.formulario}>
      {error ? <Alerta mensaje={error} /> : null}
      <Input
        etiqueta="Correo electrónico"
        etiquetaNormal={esMovil}
        icono="at-outline"
        placeholder="tu_nombre@correo.pe"
        value={correo}
        onChangeText={(v) => cambiar('correo', v, setCorreo)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={faltantes.correo}
        invalido={credencialesMalas}
        returnKeyType="next"
      />
      <Input
        etiqueta="Contraseña"
        etiquetaNormal={esMovil}
        icono="lock-closed-outline"
        placeholder="Tu contraseña"
        contrasena
        value={contrasena}
        onChangeText={(v) => cambiar('contrasena', v, setContrasena)}
        autoComplete="current-password"
        error={faltantes.contrasena}
        invalido={credencialesMalas}
        onSubmitEditing={entrar}
        returnKeyType="go"
        extraEtiqueta={
          <Text style={styles.olvido} onPress={() => router.push('/recuperar')}>
            ¿Olvidaste tu contraseña?
          </Text>
        }
      />
      <Checkbox
        etiqueta={
          Platform.OS === 'web'
            ? 'Recordar mi sesión en este dispositivo'
            : 'Recordarme en este celular'
        }
        marcado={recordar}
        onCambiar={setRecordar}
      />
      <Button
        titulo="Entrar a RunaGo"
        iconoDerecha="arrow-forward"
        cargando={cargando}
        onPress={entrar}
      />
    </View>
  );

  const crearCuenta = (
    <View style={styles.filaCentro}>
      <Text style={styles.textoPie}>¿Aún no tienes cuenta?</Text>
      <Text style={styles.enlace} onPress={() => router.replace('/registro')}>
        {esMovil ? 'Crear cuenta →' : 'Crear cuenta gratis →'}
      </Text>
    </View>
  );

  if (esMovil) {
    return (
      <AuthLayout onVolver={volver}>
        <View style={styles.movil}>
          <Destello style={styles.destelloIzq} tamano={14} />
          <Destello style={styles.destelloDer} tamano={12} />
          <View>
            <Text style={styles.tituloMovil}>¡Hola de nuevo!</Text>
            <Text style={[text.acento, styles.acentoMovil]}>entra al mapa</Text>
          </View>
          <Text style={styles.intro}>
            Vuelve a tus planes, toques caletas, ferias y experiencias guardadas.
          </Text>

          <View style={styles.panelPlanes}>
            <View style={styles.pila}>
              <Polaroid
                icono="musical-notes-outline"
                texto=""
                ancho={44}
                giro={-10}
                style={styles.pilaAtras}
              />
              <Polaroid
                icono="storefront-outline"
                texto=""
                ancho={44}
                giro={4}
                fondo={colors.crema}
              />
            </View>
            <View style={styles.planesTexto}>
              <Text style={styles.planesTitulo}>
                Tus planes te <Text style={text.acento}>esperan</Text>
              </Text>
              <Text style={styles.planesSub}>Entra y retoma donde lo dejaste.</Text>
            </View>
            <Ionicons name="bookmark-outline" size={20} color={colors.primario} />
          </View>

          {formulario}

          <View style={styles.pieMovil}>
            {crearCuenta}
            <View style={styles.filaCentro}>
              <Ionicons name="shield-checkmark-outline" size={14} color={colors.textoMedio} />
              <Text style={styles.textoChico}>Comunidad segura · Cero spam</Text>
            </View>
          </View>
        </View>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout onVolver={volver} fondo="#FDFBF9">
      <View style={styles.escritorio}>
        <View style={[styles.tarjeta, shadows.duraSm]}>
          <Insignia texto="Acceso indie · Perú" />
          <View>
            <Text style={styles.tituloWeb}>¡Hola de nuevo!</Text>
            <Text style={[text.acento, styles.acentoWeb]}>entra al mapa</Text>
          </View>
          <Text style={[styles.intro, styles.introWeb]}>
            Vuelve a tus planes, toques caletas, ferias autogestionadas y experiencias guardadas en
            Lima y todo el Perú.
          </Text>
          {formulario}
          {crearCuenta}
          <View style={styles.separador} />
          <View style={styles.filaCentro}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.turquesa} />
            <Text style={styles.textoChico}>
              Cero spam • Plataforma cultural independiente de libre acceso
            </Text>
          </View>
        </View>

        <View style={[styles.tarjeta, styles.panelCrema]}>
          <View>
            <Text style={styles.tituloPanel}>
              Tus planes te <Text style={text.acento}>esperan</Text>
            </Text>
            <Text style={styles.intro}>Entra y retoma donde lo dejaste.</Text>
          </View>

          <View style={styles.ilustracion}>
            <View style={styles.mancha} />
            <Destello style={{ position: 'absolute', top: 10, left: 30 }} tamano={22} />
            <Destello style={{ position: 'absolute', bottom: 40, left: 50 }} tamano={18} />
            <Destello style={{ position: 'absolute', bottom: 70, right: 40 }} tamano={14} />
            <Polaroid
              icono="storefront-outline"
              texto="Ferias"
              fondo={colors.crema}
              giro={-8}
              ancho={112}
              style={styles.polIzq}
            />
            <Polaroid
              icono="color-palette-outline"
              texto="Arte urbano"
              giro={7}
              ancho={106}
              style={styles.polDer}
            />
            <Polaroid
              icono="walk-outline"
              texto="Deporte"
              fondo="#E7F0E3"
              giro={-2}
              ancho={140}
              style={styles.polCentro}
            />
          </View>

          <View style={[styles.cita, shadows.duraSm]}>
            <View style={styles.citaIcono}>
              <Ionicons name="map-outline" size={20} color={colors.primario} />
            </View>
            <Text style={[styles.intro, styles.citaTexto]}>
              <Text style={styles.citaFuerte}>«La movida indie no para.»</Text> Guarda planes, arma
              tu ruta y compártela con tus amigos.
            </Text>
          </View>
        </View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  formulario: {
    gap: spacing.md,
  },
  movil: {
    padding: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  destelloIzq: {
    position: 'absolute',
    top: spacing.md,
    left: 6,
  },
  destelloDer: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.xl,
  },
  tituloMovil: {
    ...text.tituloXl,
  },
  acentoMovil: {
    fontSize: 28,
    lineHeight: 34,
  },
  intro: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textoMedio,
  },
  panelPlanes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.bordeSuave,
    backgroundColor: colors.crema,
  },
  pila: {
    width: 64,
    height: 64,
    justifyContent: 'center',
  },
  pilaAtras: {
    position: 'absolute',
    left: 0,
  },
  planesTexto: {
    flex: 1,
  },
  planesTitulo: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.texto,
  },
  planesSub: {
    ...text.cuerpoSm,
    color: colors.textoMedio,
  },
  olvido: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.turquesa,
  },
  filaCentro: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  textoPie: {
    ...text.cuerpo,
    color: colors.textoMedio,
  },
  enlace: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.primario,
  },
  textoChico: {
    ...text.cuerpoSm,
    color: colors.textoMedio,
  },
  pieMovil: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  escritorio: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    width: '100%',
    maxWidth: 1040,
    alignSelf: 'center',
  },
  tarjeta: {
    flex: 1,
    padding: spacing.xl - 8,
    gap: spacing.md + 4,
    borderRadius: radius.lg + 4,
    borderWidth: 1,
    borderColor: colors.bordeInput,
    backgroundColor: colors.blanco,
  },
  tituloWeb: {
    ...text.tituloXl,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.9,
    color: '#503431',
  },
  acentoWeb: {
    fontSize: 30,
    lineHeight: 36,
  },
  introWeb: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  separador: {
    height: 1,
    backgroundColor: colors.borde,
  },
  panelCrema: {
    backgroundColor: colors.crema,
    justifyContent: 'space-between',
  },
  tituloPanel: {
    ...text.tituloXl,
    fontSize: 26,
    lineHeight: 32,
  },
  ilustracion: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mancha: {
    position: 'absolute',
    width: 340,
    height: 220,
    bottom: 0,
    borderRadius: 170,
    transform: [{ rotate: '-8deg' }],
    backgroundColor: colors.mentaSuave,
  },
  polIzq: {
    position: 'absolute',
    left: '8%',
    top: 50,
  },
  polDer: {
    position: 'absolute',
    right: '8%',
    top: 50,
  },
  polCentro: {
    position: 'absolute',
    top: 40,
  },
  cita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.bordeInput,
    backgroundColor: colors.blanco,
  },
  citaIcono: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.crema,
  },
  citaTexto: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  citaFuerte: {
    fontFamily: fonts.bold,
    color: colors.texto,
  },
});
