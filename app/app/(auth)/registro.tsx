import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { volver } from '@/lib/navegacion';
import { Alerta, Button, Card, Input, Insignia, Logo, Screen, Segmentado } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';
import type { DatosRegistro } from '@/services/auth';
import { fonts, spacing, text } from '@/theme';

const MINIMO = 8;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Rol = DatosRegistro['rol'];
type Errores = { nombre?: string; correo?: string; contrasena?: string };

const opcionesRol: { valor: Rol; etiqueta: string }[] = [
  { valor: 'EXPLORADOR', etiqueta: 'Quiero descubrir' },
  { valor: 'ORGANIZADOR', etiqueta: 'Soy organizador' },
];

function ayudaContrasena(contrasena: string) {
  const faltan = MINIMO - contrasena.length;
  if (faltan <= 0) return '✓ Tiene al menos 8 caracteres';
  return faltan === 1 ? 'Te falta 1 carácter' : `Te faltan ${faltan} caracteres`;
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

  function cambiar(campo: keyof Errores, valor: string, setter: (v: string) => void) {
    setter(valor);
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }));
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
    <Screen fondo="crema" centrado anchoMaximo={480} bordes={['top', 'bottom']}>
      <View style={styles.cabecera}>
        <Button titulo="Volver" variante="texto" onPress={volver} />
        <Logo />
      </View>
      <Card destacada style={styles.card}>
        <Insignia texto="Cuenta nueva · Acceso libre" />
        <Text style={text.tituloXl}>
          Crea tu cuenta <Text style={{ fontFamily: fonts.tituloCursiva }}>gratis</Text>
        </Text>
        <Text style={text.cuerpo}>Guarda planes y conecta con la movida independiente.</Text>

        <Segmentado opciones={opcionesRol} valor={rol} onCambiar={setRol} />

        <Input
          etiqueta="Nombre o apodo"
          icono="person-outline"
          placeholder="Ej: Mica"
          value={nombre}
          onChangeText={(v) => cambiar('nombre', v, setNombre)}
          autoComplete="name"
          error={errores.nombre}
        />
        <Input
          etiqueta="Correo electrónico"
          icono="mail-outline"
          placeholder="tu_nombre@correo.pe"
          value={correo}
          onChangeText={(v) => cambiar('correo', v, setCorreo)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errores.correo}
        />
        <Input
          etiqueta="Contraseña"
          icono="lock-closed-outline"
          placeholder="Mínimo 8 caracteres"
          contrasena
          value={contrasena}
          onChangeText={(v) => cambiar('contrasena', v, setContrasena)}
          autoComplete="new-password"
          error={errores.contrasena}
          ayuda={contrasena ? ayudaContrasena(contrasena) : 'Mínimo 8 caracteres'}
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
          <Button
            titulo="Iniciar sesión"
            variante="texto"
            onPress={() => router.replace('/login')}
          />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  pie: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});
