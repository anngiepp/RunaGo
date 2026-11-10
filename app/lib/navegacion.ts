import { router } from 'expo-router';

// Si se abrió la pantalla directo (por ejemplo, desde un enlace en la web), vuelve a la bienvenida
export function volver() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}
