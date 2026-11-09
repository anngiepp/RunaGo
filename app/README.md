# app/

App de RunaGo para **web y Android**, hecha con Expo (SDK 57) + TypeScript y expo-router. iOS está fuera de alcance.

## Instalación

1. Instala las herramientas de calidad en la raíz del repo (ESLint y Prettier se comparten con `api/`):

   ```bash
   npm install
   ```

2. Instala la app desde la carpeta `app/`:

   ```bash
   cd app
   npm install
   ```

3. Copia `.env.example` como `.env` (ver [Variables de entorno](#variables-de-entorno)).

## Cómo correrla

### En el navegador

```bash
npx expo start
```

Cuando aparezca el menú en la terminal, presiona **`w`** para abrir la app en el navegador. También puedes usar `npm run web`.

### En tu teléfono Android con Expo Go

1. Instala **Expo Go** desde la Play Store.
2. Conecta el teléfono a la **misma red Wi-Fi** que tu PC.
3. Corre `npx expo start` y escanea el código QR de la terminal desde Expo Go.

Si el teléfono no conecta (por ejemplo, en una red de la universidad que bloquea dispositivos), prueba con:

```bash
npx expo start --tunnel
```

> Usamos SDK 57 porque es la versión que soporta la app Expo Go de la Play Store. Las sombras duras usan `boxShadow`, que en Android funciona desde la versión 9.

### Otros scripts

```bash
npm run android   # abre directo en Android (teléfono conectado o emulador)
npm run lint      # ESLint con la configuración de la raíz
npx expo export -p web   # compila la versión web en dist/
npx tsc --noEmit         # revisa los tipos (antes corre una vez npx expo start para generar los tipos de rutas)
```

## Variables de entorno

| Variable              | Ejemplo                 | Para qué sirve |
| --------------------- | ----------------------- | -------------- |
| `EXPO_PUBLIC_API_URL` | `http://localhost:3000` | URL de la API  |

⚠️ **Las variables `EXPO_PUBLIC_` son públicas.** Expo las mete dentro del código de la app, así que cualquiera puede leerlas. Nunca pongas ahí claves, contraseñas ni tokens.

Después de cambiar el `.env`, reinicia el servidor con `npx expo start --clear`.

## Probar contra la API

1. Levanta la API (ver `api/README.md`):

   ```bash
   cd api
   npm run dev
   ```

2. En `app/`, crea el `.env` a partir de `.env.example` y pon la URL de la API:
   - **En el navegador de tu PC:** `EXPO_PUBLIC_API_URL=http://localhost:3000`
   - **En tu celular con Expo Go:** `localhost` **no funciona**, porque en el celular apunta al propio celular. Usa la IP de tu PC en la red Wi-Fi, por ejemplo `EXPO_PUBLIC_API_URL=http://192.168.1.10:3000`.

     Para ver tu IP en Windows, corre `ipconfig` y busca "Dirección IPv4" en el adaptador Wi-Fi. El celular y la PC tienen que estar en la misma red, y la primera vez Windows puede pedirte permiso en el firewall para Node.js: acepta en **redes privadas**.

3. Corre `npx expo start --clear`.

4. Prueba el flujo: **Crear cuenta → elegir intereses → pestañas → Perfil → Cerrar sesión → Iniciar sesión**. El administrador del seed (`ADMIN_EMAIL`) entra a la pantalla temporal "Panel en construcción", igual que los organizadores.

La API ya permite el origen `http://localhost:8081` (la web de Expo en desarrollo). Si usas otro, agrégalo en `CORS_ORIGIN` del `.env` de la API, separado por comas.

## Sesión y redirecciones

- **Sin sesión:** Bienvenida → Iniciar sesión o Crear cuenta.
- **Explorador sin intereses:** pantalla para elegir intereses (mínimo 3). Solo aparece la primera vez.
- **Explorador con intereses:** pestañas.
- **Organizador y administrador:** pantalla temporal "Panel en construcción".
- **"Recordar mi sesión":** activado, el token queda guardado (`localStorage` en web, `expo-secure-store` en Android). Desactivado, solo dura mientras la pestaña o la app sigan abiertas.
- **Diseño:** las pantallas de acceso usan `AuthLayout`. En celular siguen los diseños MOV de `docs/stitch/` (pantalla blanca con barra superior) y en pantallas anchas los WEB (tarjeta centrada sobre fondo crema).
- **Al abrir la app** con un token guardado, se valida con `GET /me`. Si la API responde 401, el token se borra y vuelves a la bienvenida. Si no hay conexión, aparece un botón para reintentar.

## Estructura

```
app/
├── app/          → pantallas (expo-router: cada archivo es una ruta)
│   ├── _layout.tsx       → fuentes, sesión y redirecciones
│   ├── (auth)/           → bienvenida, login, registro, recuperar e intereses
│   ├── (tabs)/           → pestañas Explorar, Buscar, Plan y Perfil
│   ├── panel.tsx         → panel TEMPORAL de organizadores y administradores
│   └── componentes.tsx   → vitrina TEMPORAL del sistema de diseño
├── components/   → componentes base: Button, Input, Card, Chip, Screen, AuthLayout, Checkbox, Segmentado, TarjetaSeleccionable, Alerta…
├── theme/        → colores, tipografías, espaciados, radios y sombras
├── services/     → llamadas a la API (las pantallas no hacen fetch directo)
├── context/      → AuthContext: usuario, token y sesión
├── hooks/        → hooks propios
├── lib/          → cliente de la API, almacenamiento del token y utilidades
├── types/        → tipos compartidos (Usuario, Categoria, Rol)
└── assets/       → íconos y splash
```

## Sistema de diseño

Todo sale de `theme/`. Los componentes no usan colores escritos a mano.

- **Colores:** primario `#694A47`, menta `#96C1C5` (siempre con texto oscuro encima), crema `#FFF0DE`, texto `#221614`, fondos `#FFFFFF` y `#FAF8F5`, además de error y éxito.
- **Tipografías:** Playfair Display para títulos (con cursiva para acentos) y Manrope para la interfaz. Mientras cargan se muestra una pantalla de carga.
- **Radios:** 8 (0.5rem) y 16 (1rem); los chips usan forma de píldora.
- **Sombras duras:** desplazadas y sin desenfoque (`shadows.dura` y `shadows.duraSm`).
- **Ancho máximo:** en pantallas anchas el contenido se limita a 720 px y se centra.

Para revisar todo junto: **Perfil → Ver componentes (temporal)**.
