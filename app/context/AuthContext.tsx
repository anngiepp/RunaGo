import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { ApiError, usarToken } from '@/lib/api';
import { borrarToken, guardarToken, leerToken } from '@/lib/almacenamiento';
import * as authService from '@/services/auth';
import type { DatosRegistro } from '@/services/auth';
import type { Usuario } from '@/types';

type EstadoSesion = 'cargando' | 'lista' | 'error';

type AuthContextValue = {
  usuario: Usuario | null;
  token: string | null;
  estado: EstadoSesion;
  iniciarSesion: (correo: string, contrasena: string, recordar: boolean) => Promise<void>;
  registrar: (datos: DatosRegistro) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  actualizarUsuario: (usuario: Usuario) => void;
  reintentar: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type ResultadoSesion = { token: string; usuario: Usuario } | null | 'error';

// Si hay un token guardado, lo valida con GET /me. Un 401 significa que ya no sirve y se borra.
async function revisarSesionGuardada(): Promise<ResultadoSesion> {
  const guardado = await leerToken();
  if (!guardado) return null;

  usarToken(guardado);
  try {
    const usuario = await authService.obtenerPerfil();
    return { token: guardado, usuario };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await borrarToken();
      usarToken(null);
      return null;
    }
    return 'error';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [estado, setEstado] = useState<EstadoSesion>('cargando');

  const aplicarSesion = useCallback((resultado: ResultadoSesion) => {
    if (resultado === 'error') {
      setEstado('error');
      return;
    }
    setToken(resultado?.token ?? null);
    setUsuario(resultado?.usuario ?? null);
    setEstado('lista');
  }, []);

  useEffect(() => {
    let activo = true;
    revisarSesionGuardada().then((resultado) => {
      if (activo) aplicarSesion(resultado);
    });
    return () => {
      activo = false;
    };
  }, [aplicarSesion]);

  const iniciarSesion = useCallback(
    async (correo: string, contrasena: string, recordar: boolean) => {
      const nuevoToken = await authService.login(correo, contrasena);
      usarToken(nuevoToken);
      try {
        const perfil = await authService.obtenerPerfil();
        await guardarToken(nuevoToken, recordar);
        setToken(nuevoToken);
        setUsuario(perfil);
      } catch (error) {
        usarToken(null);
        throw error;
      }
    },
    [],
  );

  const registrar = useCallback(
    async (datos: DatosRegistro) => {
      await authService.registrar(datos);
      await iniciarSesion(datos.correo, datos.contrasena, true);
    },
    [iniciarSesion],
  );

  const cerrarSesion = useCallback(async () => {
    await borrarToken();
    usarToken(null);
    setToken(null);
    setUsuario(null);
  }, []);

  const reintentar = useCallback(() => {
    setEstado('cargando');
    revisarSesionGuardada().then(aplicarSesion);
  }, [aplicarSesion]);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        estado,
        iniciarSesion,
        registrar,
        cerrarSesion,
        actualizarUsuario: setUsuario,
        reintentar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return contexto;
}
