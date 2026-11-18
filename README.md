# RunaGo

Plataforma web y Android para descubrir eventos, lugares y experiencias en Perú, con un botón "Cómo llegar" que te lleva en transporte público.

Proyecto de titulación (línea StartUp) de Tecsup.

## Esta rama: `feature/setup-repo`

**Objetivo:** dejar listo el repositorio antes de escribir la primera línea de la app, para que todo el proyecto siga el mismo orden desde el inicio.

**Qué cambió:**

- Estructura base del monorepo: `app/`, `api/`, `infra/`, `docs/` y `.github/`.
- ESLint y Prettier configurados en la raíz para revisar y dar formato a todo el código.
- `.gitignore` para que nunca se suban secretos (`.env`) ni dependencias.
- README con el flujo de ramas (`main`, `develop`, `feature/*`) y las reglas de Conventional Commits.
- Plantilla de Pull Request con su checklist.

**Qué representa en la aplicación:** todavía no hay pantallas. Es la base de trabajo: define cómo se organiza el código, cómo se revisa y cómo se integra cada función.

**Cómo verlo:** en la raíz, `npm install` y luego `npm run lint` y `npm run format:check`.

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
