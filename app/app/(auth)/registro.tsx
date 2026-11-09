import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { volver } from '@/lib/navegacion';
import { Alerta, AuthLayout, Button, Input, Segmentado } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';
import type { DatosRegistro } from '@/services/auth';
import { colors, fonts, spacing, text } from '@/theme';

const MINIMO = 8;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Rol = DatosRegistro['rol'];
type Errores = { nombre?: string; correo?: string; contrasena?: string };

const opcionesRol = [
  { valor: 'EXPLORADOR' as Rol, etiqueta: 'Explorador', icono: 'compass-outline' as const },
  { valor: 'ORGANIZADOR' as Rol, etiqueta: 'Organizador', icono: 'megaphone-outline' as const },
];

const ayudaRol: Record<Rol, string> = {
  EXPLORADOR: 'Descubre eventos, guarda planes y elige tus intereses.',
  ORGANIZADOR: 'Podrás publicar eventos con la membresía de organizador.',
};

function ayudaContrasena(contrasena: string) {
  const faltan = MINIMO - contrasena.length;
  if (faltan <= 0) return '✓ Mínimo 8 caracteres';
  return `Mínimo 8 caracteres · te ${faltan === 1 ? 'falta 1' : `faltan ${faltan}`}`;
}

function validar(nombre: string, correo: string, contrasena: string): Errores {
  return {
    nombre: nombre.trim().length < 2 ? 'Escribe tu nombre (mínimo 2 letras)' : undefined,
    correo: CORREO_VALIDO.test(correo.trim()) ? undefined : 'Escribe un correo válido',
    contrasena: contrasena.length < MINIMO ? ayudaContrasena(contrasena) : undefined,
  };
}

export default function RegistroScreen() {
  const { registrar } = useAuth();
  const [rol, setRol] = useState<Rol>('EXPLORADOR');
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
      } else {
        setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado');
      }
      setCargando(false);
    }
  }

  return (
    <AuthLayout onVolver={volver}>
      <Text style={text.tituloXl}>
        Crea tu cuenta <Text style={styles.cursiva}>gratis</Text>
      </Text>
      <Text style={text.cuerpo}>
        Guarda planes, arma tu ruta y descubre la movida de todo el Perú.
      </Text>

      <View style={styles.rol}>
        <Segmentado opciones={opcionesRol} valor={rol} onCambiar={setRol} />
        <Text style={text.cuerpoSm}>{ayudaRol[rol]}</Text>
      </View>

      <Input
        etiqueta="Nombre o apodo"
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
          icono="at-outline"
          placeholder="tu_nombre@correo.pe"
          value={correo}
          onChangeText={(v) => cambiar('correo', v, setCorreo)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errores.correo}
        />
        {correoRepetido ? (
          <Text style={styles.enlace} onPress={() => router.replace('/login')}>
            Iniciar sesión con este correo
          </Text>
        ) : null}
      </View>
      <Input
        etiqueta="Contraseña"
        icono="lock-closed-outline"
        placeholder="Mínimo 8 caracteres"
        contrasena
        value={contrasena}
        onChangeText={(v) => cambiar('contrasena', v, setContrasena)}
        autoComplete="new-password"
        error={errores.contrasena}
        ayuda={ayudaContrasena(contrasena)}
        onSubmitEditing={crearCuenta}
        returnKeyType="go"
      />

      {error ? <Alerta mensaje={error} /> : null}

      <Button
        titulo="Crear cuenta"
        iconoDerecha="arrow-forward"
        cargando={cargando}
        onPress={crearCuenta}
      />

      <View style={styles.pie}>
        <Text style={text.cuerpoSm}>¿Ya tienes cuenta?</Text>
        <Button titulo="Iniciar sesión" variante="texto" onPress={() => router.replace('/login')} />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  cursiva: {
    fontFamily: fonts.tituloCursiva,
    color: colors.primario,
  },
  rol: {
    gap: spacing.sm,
  },
  campo: {
    gap: spacing.xs,
  },
  enlace: {
    ...text.cuerpoSm,
    fontFamily: fonts.bold,
    color: colors.primario,
    textDecorationLine: 'underline',
  },
  pie: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});
