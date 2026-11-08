import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, fuentesACargar } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fuentesListas, errorFuentes] = useFonts(fuentesACargar);
  const listo = fuentesListas || errorFuentes;

  useEffect(() => {
    if (listo) {
      SplashScreen.hideAsync();
    }
  }, [listo]);

  if (!listo) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color={colors.primario} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.fondo },
          headerStyle: { backgroundColor: colors.blanco },
          headerTintColor: colors.primario,
          headerTitleStyle: { fontFamily: fonts.bold, color: colors.texto },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="componentes"
          options={{ headerShown: true, title: 'Componentes (temporal)' }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  cargando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.fondo,
  },
});
