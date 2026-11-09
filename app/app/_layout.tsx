import { useEffect } from 'react';
import { Text } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Alerta, Button, Cargando, Screen } from '@/components';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { colors, fonts, fuentesACargar, text } from '@/theme';

SplashScreen.preventAutoHideAsync();

function Navegacion() {
  const { usuario, estado, reintentar } = useAuth();

  if (estado === 'cargando') {
    return <Cargando mensaje="Revisando tu sesión..." />;
  }

  if (estado === 'error') {
    return (
      <Screen centrado anchoMaximo={480}>
        <Text style={text.tituloMd}>No pudimos abrir tu sesión</Text>
        <Alerta mensaje="No pudimos conectar. Revisa tu internet e inténtalo de nuevo" />
        <Button titulo="Reintentar" onPress={reintentar} />
      </Screen>
    );
  }

  const esExplorador = usuario?.rol === 'EXPLORADOR';
  const necesitaIntereses = esExplorador && usuario.intereses.length === 0;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.fondo },
        headerStyle: { backgroundColor: colors.blanco },
        headerTintColor: colors.primario,
        headerTitleStyle: { fontFamily: fonts.bold, color: colors.texto },
      }}
    >
      <Stack.Protected guard={!usuario || necesitaIntereses}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={esExplorador && !necesitaIntereses}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="componentes"
          options={{ headerShown: true, title: 'Componentes (temporal)' }}
        />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(usuario) && !esExplorador}>
        <Stack.Screen name="panel" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fuentesListas, errorFuentes] = useFonts(fuentesACargar);
  const listo = fuentesListas || errorFuentes;

  useEffect(() => {
    if (listo) {
      SplashScreen.hideAsync();
    }
  }, [listo]);

  if (!listo) {
    return <Cargando />;
  }

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Navegacion />
    </AuthProvider>
  );
}
