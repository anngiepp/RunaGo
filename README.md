# RunaGo

Plataforma web y Android para descubrir eventos, lugares y experiencias en Perú, con un botón "Cómo llegar" que te lleva en transporte público.

Proyecto de titulación (línea StartUp) de Tecsup.

## Esta rama: `feature/login-intereses`

**Objetivo:** conectar la app con la API para que una persona pueda registrarse, iniciar sesión y elegir sus intereses, con pantallas iguales a los diseños de Stitch.

**Qué cambió:**

- Cliente de la API (`lib/api.ts`) con errores en español y tiempo límite de espera.
- Sesión guardada de forma segura: `expo-secure-store` en Android y `localStorage` o `sessionStorage` en web.
- `AuthContext` con iniciar sesión, registrarse y cerrar sesión.
- Pantallas de bienvenida, iniciar sesión, crear cuenta y elegir intereses, en versión celular (MOV) y escritorio (WEB).
- Redirecciones por rol: el explorador sin intereses va a elegirlos; con intereses, a las pestañas. Organizador y administrador van a un panel temporal.
- Escala compacta: login y registro ocupan la pantalla sin hacer scroll.

**Qué representa en la aplicación:** es la puerta de entrada. Es lo primero que ve cualquier persona que abre RunaGo.

**Cómo verlo:** con la API corriendo, en `app/` corre `npx expo start --clear` y presiona `w`. Prueba crear cuenta → elegir intereses → Perfil → cerrar sesión → iniciar sesión.

## ¿Qué es RunaGo?

RunaGo ayuda a jóvenes de 18 a 35 años (y también a turistas) a encontrar qué hacer cerca de ellos. Hay tres tipos de usuario:

- **Explorador**: busca eventos y lugares, guarda favoritos y deja reseñas.
- **Organizador**: crea y gestiona sus eventos.
- **Administrador**: modera el contenido y los usuarios.

El modelo de negocio es solo por membresías (Explorador Premium y Organizador Básico/Pro). Los pagos son simulados con Stripe en modo test. No se venden entradas ni se cobran comisiones.

## Stack

| Parte                    | Tecnología                                              |
| ------------------------ | ------------------------------------------------------- |
| App (web y Android)      | Expo (React Native) + TypeScript, expo-router, MapLibre |
| API                      | Express + TypeScript + Prisma, JWT + bcrypt             |
| Base de datos y archivos | Supabase (PostgreSQL + Storage)                         |
| Hosting                  | Vercel (web) y Render (API)                             |
| Calidad                  | ESLint + Prettier                                       |

Todo funciona con planes gratuitos.

## Estructura de carpetas

```
runago/
├── app/      → app Expo (web + Android)
├── api/      → API con Express + Prisma
├── infra/    → configuración de despliegue y variables de ejemplo
├── docs/     → capítulos, diagramas, vistas de diseño y notas por sprint
└── .github/  → plantilla de Pull Request
```

## Ramas

- `main`: versión estable. Nunca se hace commit directo aquí.
- `develop`: rama de integración.
- `feature/*`: una rama por tarea, creada desde `develop` (por ejemplo `feature/login`).

Cada `feature/*` se integra a `develop` con un Pull Request.

## Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/):

- `feat:` nueva funcionalidad
- `fix:` corrección de un error
- `chore:` configuración o tareas de mantenimiento
- `docs:` documentación
- `test:` pruebas

Ejemplo: `feat: agrega pantalla de inicio de sesión`

## Calidad de código

Desde la raíz:

```bash
npm install
npm run lint      # revisa el código con ESLint
npm run format    # da formato con Prettier
```

## Variables de entorno

Los secretos van en archivos `.env`, que git ignora. Solo se sube `.env.example`, sin valores reales.

## Cómo levantar el proyecto

Esta sección se completará en cada sprint, a medida que se creen la app y la API.
