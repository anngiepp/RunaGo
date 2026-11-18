# RunaGo

Plataforma web y Android para descubrir eventos, lugares y experiencias en Perú, con un botón "Cómo llegar" que te lleva en transporte público.

Proyecto de titulación (línea StartUp) de Tecsup.

## Esta rama: `feature/app-base-tema`

**Objetivo:** crear la app y su identidad visual, para que todas las pantallas que vengan después se vean iguales.

**Qué cambió:**

- Proyecto Expo con TypeScript y expo-router, un solo código para web y Android.
- Tema "RunaGo Indie Youth": colores (café, menta y crema), tipografías (Playfair Display y Manrope), espacios, radios y sombras duras.
- Componentes base reutilizables: botón, campo de texto, tarjeta, chip y pantalla.
- Navegación inferior con las pestañas Explorar, Buscar, Plan y Perfil.
- Vitrina temporal de componentes para revisarlos juntos.

**Qué representa en la aplicación:** es el esqueleto visual: la barra de pestañas y el estilo que comparten todas las pantallas.

**Cómo verlo:** en `app/`, `npm install` y `npx expo start`. Presiona `w` y entra a Perfil → Ver componentes.

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
