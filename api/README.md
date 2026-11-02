# api/

API REST de RunaGo con Express 5 + TypeScript + Prisma 7 (PostgreSQL en Supabase).

## Instalación

Desde la carpeta `api/`:

```bash
npm install
```

Al instalar se ejecuta `prisma generate`, que crea el cliente de Prisma en `src/generated/` (esa carpeta no se sube a git).

## Variables de entorno

Copia `.env.example` como `.env` y completa tus datos de Supabase:

| Variable       | Obligatoria | Para qué sirve                                                                |
| -------------- | ----------- | ----------------------------------------------------------------------------- |
| `PORT`         | Sí          | Puerto de la API (por ejemplo `3000`)                                         |
| `DATABASE_URL` | Sí          | Conexión que usa la app (Supabase, _Transaction pooler_, puerto 6543)         |
| `DIRECT_URL`   | Sí          | Conexión para migraciones de Prisma (Supabase, _Session pooler_, puerto 5432) |
| `CORS_ORIGIN`  | No          | Orígenes permitidos, separados por coma. Por defecto `http://localhost:8081`  |

Si falta una variable obligatoria, el servidor no arranca y muestra cuál falta.

## Cómo correrlo

```bash
npm run dev     # desarrollo, se recarga solo al guardar
npm run build   # genera el cliente de Prisma y compila a dist/
npm start       # corre la versión compilada
```

## Endpoints

- `GET /health` → `{ "ok": true }`
- `GET /health/db` → prueba la conexión a la base (`SELECT 1`). Responde `{ "ok": true }` o un error 503 si no conecta.

## Estructura

```
src/
├── config/       → variables de entorno (validadas con zod)
├── routes/       → solo definen las rutas
├── controllers/  → reciben la petición y responden
├── services/     → lógica del negocio (Prisma solo aquí)
├── middlewares/  → manejo de errores
├── validators/   → esquemas de zod
├── lib/          → cliente de Prisma
├── app.ts        → configuración de Express
└── index.ts      → arranque del servidor
prisma/
└── schema.prisma → datasource y generator (los modelos vienen después)
```
