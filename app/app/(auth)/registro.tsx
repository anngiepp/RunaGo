import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Alerta,
  AuthLayout,
  Button,
  Destello,
  Input,
  Insignia,
  Polaroid,
  Segmentado,
} from '@/components';
import { useAuth } from '@/context/AuthContext';
import { useEsMovil } from '@/hooks/useEsMovil';
import { ApiError } from '@/lib/api';
import { volver } from '@/lib/navegacion';
import type { DatosRegistro } from '@/services/auth';
import { colors, fonts, radius, shadows, spacing, text } from '@/theme';

const MINIMO = 8;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Rol = DatosRegistro['rol'];
type Errores = { nombre?: string; correo?: string; contrasena?: string };

function validar(nombre: string, correo: string, contrasena: string): Errores {
  return {
    nombre: nombre.trim().length < 2 ? 'Escribe tu nombre (mínimo 2 letras)' : undefined,
    correo: CORREO_VALIDO.test(correo.trim()) ? undefined : 'Escribe un correo válido',
    contrasena: contrasena.length < MINIMO ? 'falta' : undefined,
  };
}

export default function RegistroScreen() {
  const esMovil = useEsMovil();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ rol?: string }>();
  const { registrar } = useAuth();
  const [rol, setRol] = useState<Rol>(params.rol === 'ORGANIZADOR' ? 'ORGANIZADOR' : 'EXPLORADOR');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState<Errores>({});
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [correoRepetido, setCorreoRepetido] = useState(false);

  function cambiar(campo: keyof Errores, valor: string, setter: (v: string) => void) {
    setter(valor);
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }));
    if (campo === 'correo') setCorreoRepetido(false);
  }

  async function crearCuenta() {
    const nuevos = validar(nombre, correo, contrasena);
    setErrores(nuevos);
    setError('');
    if (nuevos.nombre || nuevos.correo || nuevos.contrasena) return;

    setCargando(true);
    try {
      await registrar({ nombre: nombre.trim(), correo: correo.trim(), contrasena, rol });
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        setErrores({ correo: e.message });
        setCorreoRepetido(true);
      } else if (e instanceof ApiError && e.detalles.length > 0) {
        const porCampo: Errores = {};
        for (const detalle of e.detalles) {
          if (
            detalle.campo === 'nombre' ||
            detalle.campo === 'correo' ||
            detalle.campo === 'contrasena'
          ) {
            porCampo[detalle.campo] = detalle.mensaje;
          }
        }
        setErrores(porCampo);
        if (porCampo.contrasena) setError(porCampo.contrasena);
      } else {
        setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado');
      }
      setCargando(false);
    }
  }

  const faltan = MINIMO - contrasena.length;
  const contrasenaOk = faltan <= 0;
  const requisitoBase = esMovil ? 'Mínimo 8 caracteres' : '8+ caracteres';
  const requisito =
    contrasenaOk || contrasena.length === 0
      ? requisitoBase
      : `${requisitoBase} · te ${faltan === 1 ? 'falta 1' : `faltan ${faltan}`}`;
  const colorRequisito = contrasenaOk
    ? colors.exito
    : errores.contrasena
      ? colors.error
      : colors.textoSuave;

  const opcionesRol = esMovil
    ? [
        { valor: 'EXPLORADOR' as Rol, etiqueta: 'Explorador', icono: 'compass-outline' as const },
        {
          valor: 'ORGANIZADOR' as Rol,
          etiqueta: 'Organizador',
          icono: 'megaphone-outline' as const,
        },
      ]
    : [
        { valor: 'EXPLORADOR' as Rol, etiqueta: 'Quiero descubrir' },
        { valor: 'ORGANIZADOR' as Rol, etiqueta: 'Soy organizador' },
      ];

  const formulario = (
    <View style={styles.formulario}>
      <View style={styles.rol}>
        <Segmentado opciones={opcionesRol} valor={rol} onCambiar={setRol} />
        {esMovil ? (
          <Text style={styles.nota}>Podrás publicar eventos con la membresía de organizador.</Text>
        ) : null}
      </View>

      <Input
        etiqueta="Nombre o apodo"
        relleno="suave"
        icono="person-outline"
        placeholder="Ej: Mica en ruta"
        value={nombre}
        onChangeText={(v) => cambiar('nombre', v, setNombre)}
        autoComplete="name"
        error={errores.nombre}
      />
      <View style={styles.campo}>
        <Input
          etiqueta="Correo electrónico"
          relleno="suave"
          icono={esMovil ? 'at-outline' : 'mail-outline'}
          placeholder="tu_nombre@correo.pe"
          value={correo}
          onChangeText={(v) => cambiar('correo', v, setCorreo)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errores.correo}
        />
        {correoRepetido ? (
          <Text style={styles.enlaceSubrayado} onPress={() => router.replace('/login')}>
            Iniciar sesión con este correo
          </Text>
        ) : null}
      </View>
      <View style={styles.campo}>
        <Input
          etiqueta="Contraseña"
          relleno="suave"
          icono="lock-closed-outline"
          placeholder="Crea tu clave segura"
          contrasena
          value={contrasena}
          onChangeText={(v) => cambiar('contrasena', v, setContrasena)}
          autoComplete="new-password"
          invalido={Boolean(errores.contrasena)}
          onSubmitEditing={crearCuenta}
          returnKeyType="go"
        />
        <View style={styles.requisito}>
          <Ionicons
            name={
              errores.contrasena && !contrasenaOk
                ? 'close-circle-outline'
                : 'checkmark-circle-outline'
            }
            size={16}
            color={colorRequisito}
          />
          <Text style={[styles.textoRequisito, { color: colorRequisito }]}>{requisito}</Text>
        </View>
      </View>

      {error ? <Alerta mensaje={error} /> : null}

      <Button
        titulo={esMovil ? 'Crear cuenta' : 'Crear cuenta y explorar'}
        iconoDerecha="arrow-forward"
        cargando={cargando}
        onPress={crearCuenta}
      />

      <View style={styles.filaCentro}>
        <Text style={styles.textoPie}>¿Ya tienes cuenta?</Text>
        <Text style={styles.enlaceSubrayado} onPress={() => router.replace('/login')}>
          Iniciar sesión →
        </Text>
      </View>
    </View>
  );

  const titulo = (
    <Text style={esMovil ? styles.tituloMovil : styles.tituloWeb}>
      Crea tu cuenta <Text style={text.acento}>gratis</Text>
    </Text>
  );

  if (esMovil) {
    return (
      <AuthLayout onVolver={volver}>
        <View style={styles.movil}>
          <View style={styles.banner}>
            <View style={styles.tira}>
              <Polaroid
                icono="storefront-outline"
                texto="Ferias"
                ancho={70}
                giro={-6}
                fondo={colors.crema}
              />
              <Polaroid icono="musical-notes-outline" texto="Jazz" ancho={70} giro={3} />
              <Polaroid
                icono="color-palette-outline"
                texto="Arte urbano"
                ancho={70}
                giro={-3}
                fondo="#F6D9C8"
              />
              <Polaroid
                icono="sunny-outline"
                texto="Cultura andina"
                ancho={70}
                giro={5}
                fondo="#E7F0E3"
              />
            </View>
            <View style={[styles.etiquetaFlotante, { left: spacing.md, bottom: spacing.sm }]}>
              <Text style={styles.textoFlotante}>Indie</Text>
            </View>
            <View style={[styles.etiquetaFlotante, { alignSelf: 'center', top: spacing.xs }]}>
              <Text style={styles.textoFlotante}>Arte urbano</Text>
            </View>
            <View style={[styles.etiquetaFlotante, { right: spacing.md, bottom: spacing.sm }]}>
              <Text style={styles.textoFlotante}>Cultura andina</Text>
            </View>
          </View>
          {titulo}
          <Text style={styles.intro}>
            Guarda planes, arma tu ruta y descubre la movida de todo el Perú.
          </Text>
          {formulario}
        </View>
      </AuthLayout>
    );
  }

  const conLaterales = width >= 1100;

  return (
    <AuthLayout onVolver={volver} fondo={colors.crema}>
      <View style={styles.escritorio}>
        {conLaterales ? (
          <View style={styles.lateral}>
            <View style={[styles.chipLateral, shadows.duraSm]}>
              <Ionicons name="checkmark" size={14} color={colors.texto} />
              <Text style={styles.textoFlotante}>Ferias</Text>
            </View>
            <Polaroid
              icono="storefront-outline"
              texto="Ferias · Barranco"
              ancho={140}
              giro={-3}
              fondo="#FBEBDD"
            />
            <Polaroid
              icono="color-palette-outline"
              texto="Mural y arte urbano"
              ancho={140}
              giro={2}
              fondo="#F6D9C8"
              style={styles.desplazado}
            />
            <Polaroid
              icono="walk-outline"
              texto="Aire libre"
              ancho={134}
              giro={-2}
              fondo="#E7F0E3"
            />
          </View>
        ) : null}

        <View style={styles.centro}>
          <Destello style={{ position: 'absolute', top: -10, left: -50 }} />
          <Destello style={{ position: 'absolute', top: -10, right: -50 }} />
          <View style={[styles.tarjeta, shadows.duraSm]}>
            <View style={styles.cintaTarjeta} />
            <Insignia
              texto={
                rol === 'EXPLORADOR'
                  ? 'Perfil descubridor · Acceso libre'
                  : 'Perfil organizador · Acceso libre'
              }
            />
            <View style={styles.encabezado}>
              {titulo}
              <Text style={styles.intro}>
                Guarda planes, arma rutas y conecta con la movida independiente de todo el Perú.
              </Text>
            </View>
            {formulario}
          </View>
          <Destello style={{ position: 'absolute', bottom: -10, left: -50 }} />
          <Destello style={{ position: 'absolute', bottom: -10, right: -50 }} />
        </View>

        {conLaterales ? (
          <View style={styles.lateral}>
            <View style={[styles.chipLateral, styles.chipMenta, shadows.duraSm]}>
              <Ionicons name="checkmark" size={14} color={colors.texto} />
              <Text style={styles.textoFlotante}>Jazz</Text>
            </View>
            <Polaroid icono="musical-notes-outline" texto="Jazz en vivo" ancho={140} giro={3} />
            <Polaroid
              icono="disc-outline"
              texto="Indie"
              ancho={140}
              giro={-3}
              fondo="#EDE3F3"
              style={styles.desplazado}
            />
            <Polaroid
              icono="sunny-outline"
              texto="Cultura andina"
              ancho={134}
              giro={3}
              fondo="#FBEBDD"
            />
          </View>
        ) : null}
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
    gap: spacing.md,
  },
  banner: {
    height: 150,
    justifyContent: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.bordeSuave,
    backgroundColor: colors.crema,
    overflow: 'hidden',
  },
  tira: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.sm,
  },
  etiquetaFlotante: {
    position: 'absolute',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.blanco,
  },
  textoFlotante: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.texto,
  },
  tituloMovil: {
    ...text.tituloXl,
    fontSize: 30,
    lineHeight: 36,
  },
  tituloWeb: {
    ...text.tituloXl,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.8,
  },
  intro: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textoMedio,
  },
  rol: {
    gap: spacing.sm,
  },
  nota: {
    ...text.cuerpoSm,
    fontSize: 12,
    marginLeft: spacing.xs,
  },
  campo: {
    gap: spacing.sm,
  },
  requisito: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  textoRequisito: {
    fontFamily: fonts.semibold,
    fontSize: 13,
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
  enlaceSubrayado: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primario,
    textDecorationLine: 'underline',
  },
  escritorio: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: spacing.xl * 1.5,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  lateral: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
    alignItems: 'center',
  },
  desplazado: {
    marginLeft: spacing.xl,
  },
  chipLateral: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.texto,
    backgroundColor: colors.blanco,
    marginBottom: -spacing.lg,
    zIndex: 2,
  },
  chipMenta: {
    backgroundColor: colors.menta,
  },
  centro: {
    width: '100%',
    maxWidth: 460,
  },
  tarjeta: {
    padding: spacing.xl - 8,
    gap: spacing.md + 4,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.bordeInput,
    backgroundColor: colors.blanco,
  },
  cintaTarjeta: {
    position: 'absolute',
    top: -14,
    alignSelf: 'center',
    width: 110,
    height: 28,
    backgroundColor: 'rgba(150, 193, 197, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(59, 101, 105, 0.25)',
  },
  encabezado: {
    gap: spacing.sm,
  },
});
