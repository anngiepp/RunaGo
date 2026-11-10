# Sprint 1

## Objetivo

Dejar lista la base del proyecto: repositorio ordenado, API con base de datos y autenticación, y una app (web y Android) donde una persona pueda crear su cuenta, iniciar sesión, elegir sus intereses y probar el botón "Cómo llegar".

## Lo que se hizo

| Rama                         | Qué se hizo                                                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `feature/setup-repo`         | Estructura del repo (`app/`, `api/`, `infra/`, `docs/`), `.gitignore`, ESLint, Prettier, README y plantilla de PR            |
| `feature/api-base`           | Servidor Express con TypeScript, variables de entorno validadas con zod y endpoints `/health` y `/health/db`                 |
| `feature/modelo-datos`       | Modelo de datos con Prisma en Supabase, primera migración, seed con datos de ejemplo y diagrama entidad-relación             |
| `feature/auth-roles`         | Registro y login con JWT y bcrypt, `/me`, intereses, categorías, middlewares por rol y pruebas con vitest                    |
| `feature/app-base-tema`      | Proyecto Expo, tema "RunaGo Indie Youth", componentes base y navegación por pestañas                                         |
| `feature/login-intereses`    | App conectada a la API: bienvenida, login, registro, elegir intereses y redirecciones por rol, igual a los diseños de Stitch |
| `feature/como-llegar-cierre` | Función "Cómo llegar" con pruebas, botón de prueba temporal, README para levantar todo desde cero y este documento           |

En resumen, al terminar el sprint:

- Se puede crear una cuenta de explorador u organizador e iniciar sesión.
- El explorador elige al menos 3 intereses la primera vez y luego llega a las pestañas (Explorar, Buscar, Plan, Perfil).
- Organizadores y administradores llegan a un panel temporal.
- El botón "Cómo llegar" abre Google Maps con la ruta en transporte público.
- Las pantallas de acceso siguen los diseños de celular (MOV) y de escritorio (WEB).

## Lo que quedó pendiente

- **Probar en un Android real** con Expo Go. Hasta ahora se probó en el navegador, en tamaños de celular y de escritorio.
- **Quitar en el Sprint 2:**
  - la vitrina de componentes (`app/app/componentes.tsx` y su enlace en Perfil)
  - el botón de prueba temporal de "Cómo llegar" en Explorar, cuando exista el endpoint de eventos
- Reemplazar el panel temporal de organizadores y administradores por los módulos reales (7 y 8).
- "¿Olvidaste tu contraseña?" solo muestra un aviso: la recuperación de contraseña no está hecha.
- Verificar las coordenadas de los lugares del seed (son aproximadas).
- Desplegar la web en Vercel y la API en Render.
- Decidir si se suben a git los diseños de `docs/stitch/`.

## Decisiones técnicas importantes

- **Un solo proyecto Expo para web y Android.** iOS queda fuera del alcance. Se usa el SDK 57 porque es el que soporta la app Expo Go de la Play Store.
- **API por capas:** `routes → controllers → services`. Prisma solo se usa en `services/`. Las respuestas siempre son `{ ok: true, ... }` o `{ ok: false, error }`, con mensajes en español.
- **Supabase con dos conexiones:** `DATABASE_URL` (pooler, para la API) y `DIRECT_URL` (para las migraciones). No se usa la base de datos de Render.
- **Seguridad:**
  - contraseñas con bcrypt y sesiones con JWT
  - el registro nunca crea administradores
  - los secretos van en `.env` (ignorado por git) y solo se suben los `.env.example`
- **Token en la app:** `expo-secure-store` en Android. En web, `localStorage` si se marca "Recordar mi sesión" y `sessionStorage` si no. Al abrir la app, el token se valida con `GET /me`.
- **Las pantallas no hacen fetch directo:** usan `services/` y `context/AuthContext.tsx`.
- **Diseño:**
  - por debajo de 768 px se usan los diseños MOV y desde ahí los WEB
  - en lugar de fotos y datos inventados se usan ilustraciones
  - los títulos van en Manrope ExtraBold y el acento en Playfair Display cursiva, como en Stitch
- **"Cómo llegar" sin APIs de pago:** es un enlace a Google Maps con `travelmode=transit`. La URL se arma en una función pura (`app/lib/urlComoLlegar.ts`) para poder probarla con vitest. Si no hay origen, Google usa la ubicación actual del usuario.

## Cómo probar

Los pasos completos para levantar todo desde cero están en el [README principal](../README.md). En corto:

1. API: en `api/`, `npm run dev`.
2. App: en `app/`, `npx expo start --clear` y presiona `w`.
3. Prueba el flujo:
   1. Crear cuenta → elegir intereses → Explorar
   2. Botón "Cómo llegar" (debe abrir Google Maps hacia el MALI en una pestaña nueva)
   3. Perfil → Cerrar sesión → Iniciar sesión
4. Prueba también los errores: contraseña incorrecta, correo repetido y registro como organizador.
5. Revisiones:
   - en la raíz: `npm run lint` y `npm run format:check`
   - en `api/`: `npm test` (12 pruebas)
   - en `app/`: `npm test` (5 pruebas), `npx tsc --noEmit` y `npx expo export -p web`
