import * as SecureStore from 'expo-secure-store';

const CLAVE = 'runago_token';

// En Android, si no se recuerda la sesión, el token solo vive en memoria mientras la app está abierta
export async function guardarToken(token: string, recordar: boolean) {
  if (recordar) {
    await SecureStore.setItemAsync(CLAVE, token);
  } else {
    await SecureStore.deleteItemAsync(CLAVE);
  }
}

export async function leerToken() {
  return SecureStore.getItemAsync(CLAVE);
}

export async function borrarToken() {
  await SecureStore.deleteItemAsync(CLAVE);
}
