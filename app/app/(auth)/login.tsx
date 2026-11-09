import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { volver } from '@/lib/navegacion';
import { Alerta, Button, Card, Checkbox, Input, Insignia, Logo, Screen } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';
import { colors, fonts, spacing, text } from '@/theme';

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
    <Screen fondo="crema" centrado anchoMaximo={480} bordes={['top', 'bottom']}>
      <View style={styles.cabecera}>
        <Button titulo="Volver" variante="texto" onPress={volver} />
        <Logo />
      </View>
      <Card destacada style={styles.card}>
        <Insignia texto="Acceso · RunaGo" />
        <Text style={text.tituloXl}>
          ¡Hola de <Text style={{ fontFamily: fonts.tituloCursiva }}>nuevo</Text>!
        </Text>
        <Text style={text.cuerpo}>Entra para retomar tus planes y eventos guardados.</Text>

        <Input
          etiqueta="Correo electrónico"
          icono="mail-outline"
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
          etiqueta="Recordar mi sesión en este dispositivo"
          marcado={recordar}
          onCambiar={setRecordar}
        />

        {error ? <Alerta mensaje={error} /> : null}

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
  enlace: {
    ...text.cuerpoSm,
    fontFamily: fonts.semibold,
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
