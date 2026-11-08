import { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/theme';

type NombreIcono = ComponentProps<typeof Ionicons>['name'];

function icono(activo: NombreIcono, inactivo: NombreIcono) {
  function TabIcono({
    color,
    size,
    focused,
  }: {
    color: ColorValue;
    size: number;
    focused: boolean;
  }) {
    return <Ionicons name={focused ? activo : inactivo} size={size} color={color} />;
  }
  return TabIcono;
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primario,
        tabBarInactiveTintColor: colors.textoSuave,
        tabBarStyle: {
          backgroundColor: colors.blanco,
          borderTopColor: colors.borde,
          height: 64 + insets.bottom,
          paddingTop: 4,
          paddingBottom: 4 + insets.bottom,
        },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Explorar', tabBarIcon: icono('compass', 'compass-outline') }}
      />
      <Tabs.Screen
        name="buscar"
        options={{ title: 'Buscar', tabBarIcon: icono('search', 'search-outline') }}
      />
      <Tabs.Screen
        name="plan"
        options={{ title: 'Plan', tabBarIcon: icono('calendar', 'calendar-outline') }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: 'Perfil', tabBarIcon: icono('person', 'person-outline') }}
      />
    </Tabs>
  );
}
