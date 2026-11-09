import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { volver } from '@/lib/navegacion';
import { Alerta, AuthLayout, Button, Checkbox, Input } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';
import { colors, fonts, text } from '@/theme';

export default function LoginScreen() {
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
      const mensaje = e instanceof Error ? e.message : 'Ocurrió un error inesperado';
      setError(mensaje);
      setCredencialesMalas(e instanceof ApiError && e.status === 401);
      setCargando(false);
    }
  }

  return (
    <AuthLayout onVolver={volver}>
      <View>
        <Text style={text.tituloXl}>¡Hola de nuevo!</Text>
        <Text style={styles.subtitulo}>entra al mapa</Text>
      </View>
      <Text style={text.cuerpo}>Vuelve a tus planes, ferias y experiencias guardadas.</Text>

      {error ? <Alerta mensaje={error} /> : null}

      <Input
        etiqueta="Correo electrónico"
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
          <Text style={styles.enlace} onPress={() => router.push('/recuperar')}>
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

      <View style={styles.pie}>
        <Text style={text.cuerpoSm}>¿Aún no tienes cuenta?</Text>
        <Button
          titulo="Crear cuenta"
          variante="texto"
          onPress={() => router.replace('/registro')}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  subtitulo: {
    ...text.tituloLg,
    fontFamily: fonts.tituloCursiva,
    color: colors.primario,
  },
  enlace: {
    ...text.cuerpoSm,
    fontFamily: fonts.semibold,
    color: colors.primario,
  },
  pie: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});
