import { Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme';

export default function AuthLayout() {
  const { usuario } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.crema } }}>
      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="registro" />
        <Stack.Screen name="recuperar" />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(usuario)}>
        <Stack.Screen name="intereses" />
      </Stack.Protected>
    </Stack>
  );
}
