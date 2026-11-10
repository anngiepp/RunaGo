const CLAVE = 'runago_token';

// localStorage queda guardado; sessionStorage se borra al cerrar la pestaña
function almacen(tipo: 'local' | 'session') {
  try {
    return tipo === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export async function guardarToken(token: string, recordar: boolean) {
  await borrarToken();
  almacen(recordar ? 'local' : 'session')?.setItem(CLAVE, token);
}

export async function leerToken() {
  return almacen('local')?.getItem(CLAVE) ?? almacen('session')?.getItem(CLAVE) ?? null;
}

export async function borrarToken() {
  almacen('local')?.removeItem(CLAVE);
  almacen('session')?.removeItem(CLAVE);
}
