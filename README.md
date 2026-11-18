# RunaGo

Plataforma web y Android para descubrir eventos, lugares y experiencias en Perú, con un botón "Cómo llegar" que te lleva en transporte público.

Proyecto de titulación (línea StartUp) de Tecsup.

## Esta rama: `feature/modelo-datos`

**Objetivo:** diseñar cómo se guarda la información de RunaGo en la base de datos.

**Qué cambió:**

- Modelo de datos con Prisma: usuarios con rol, categorías, lugares, eventos, favoritos, intereses, membresías, reseñas y fotos.
- Primera migración en Supabase.
- Seed con datos de ejemplo: 15 categorías, 8 lugares reales de Lima, eventos de prueba, un administrador y organizadores.
- `docs/modelo-datos.md` y el diagrama entidad-relación (`docs/er-runago.png`).

**Qué representa en la aplicación:** define todo lo que la app va a poder mostrar: los eventos con su lugar y categoría, los intereses de cada persona y lo que guarda en favoritos.

**Cómo verlo:** en `api/`, `npx prisma migrate deploy` y `npm run db:seed`. Luego `npx prisma studio` para ver las tablas con datos.

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
