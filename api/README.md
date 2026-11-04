# api/

API REST de RunaGo con Express 5 + TypeScript + Prisma 7 (PostgreSQL en Supabase).

## Instalación

Desde la carpeta `api/`:

```bash
npm install
```

Al instalar se ejecuta `prisma generate`, que crea el cliente de Prisma en `src/generated/` (esa carpeta no se sube a git).

## Variables de entorno

Copia `.env.example` como `.env` y completa tus datos:

| Variable               | Obligatoria | Para qué sirve                                                                |
| ---------------------- | ----------- | ----------------------------------------------------------------------------- |
| `PORT`                 | Sí          | Puerto de la API (por ejemplo `3000`)                                         |
| `DATABASE_URL`         | Sí          | Conexión que usa la app (Supabase, _Transaction pooler_, puerto 6543)         |
| `DIRECT_URL`           | Sí          | Conexión para migraciones de Prisma (Supabase, _Session pooler_, puerto 5432) |
| `CORS_ORIGIN`          | No          | Orígenes permitidos, separados por coma. Por defecto `http://localhost:8081`  |
| `JWT_SECRET`           | Sí          | Clave para firmar los tokens. Mínimo 32 caracteres                            |
| `JWT_EXPIRES_IN`       | No          | Duración de la sesión. Por defecto `7d`                                       |
| `ADMIN_EMAIL`          | Para seed   | Correo del administrador que crea `npm run db:seed`                           |
| `ADMIN_PASSWORD`       | Para seed   | Contraseña de ese administrador                                               |
| `ORGANIZADOR_PASSWORD` | No          | Contraseña de los organizadores de prueba del seed                            |

Si falta una variable obligatoria, el servidor no arranca y muestra cuál falta.

Para generar un `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Cómo correrlo

```bash
npm run dev         # desarrollo, se recarga solo al guardar
npm run build       # genera el cliente de Prisma y compila a dist/
npm start           # corre la versión compilada
npm test            # pruebas con vitest (no usan la base real)
npm run db:migrate  # aplica migraciones en desarrollo
npm run db:seed     # carga datos de ejemplo
```

## Endpoints

Las rutas con token necesitan la cabecera `Authorization: Bearer <token>`. Los errores siempre vienen como `{ "ok": false, "error": "mensaje en español" }`.

| Método | Ruta             | Token | Qué hace                                        |
| ------ | ---------------- | ----- | ----------------------------------------------- |
| GET    | `/health`        | No    | Responde `{ "ok": true }`                       |
| GET    | `/health/db`     | No    | Prueba la conexión a la base. 503 si no conecta |
| POST   | `/auth/registro` | No    | Crea una cuenta de explorador u organizador     |
| POST   | `/auth/login`    | No    | Devuelve un token y los datos del usuario       |
| GET    | `/me`            | Sí    | Datos del usuario actual con sus intereses      |
| PUT    | `/me/intereses`  | Sí    | Reemplaza los intereses del usuario             |
| GET    | `/categorias`    | No    | Lista todas las categorías (son los intereses)  |

### POST /auth/registro

```json
{
  "nombre": "Ana Torres",
  "correo": "ana@correo.com",
  "contrasena": "minimo8caracteres",
  "rol": "EXPLORADOR"
}
```

- `rol` puede ser `EXPLORADOR` u `ORGANIZADOR`. Nunca se puede crear un `ADMIN` desde aquí.
- El correo se guarda en minúsculas. La contraseña debe tener entre 8 y 72 caracteres.
- Responde `201` con `{ "ok": true, "usuario": {...} }`, o `409` si el correo ya existe.

### POST /auth/login

```json
{
  "correo": "ana@correo.com",
  "contrasena": "minimo8caracteres"
}
```

Responde `{ "ok": true, "token": "...", "usuario": {...} }`. Si el correo o la contraseña fallan, siempre responde `401` con `"Correo o contraseña incorrectos"`.

### GET /me

Responde `{ "ok": true, "usuario": { "id", "nombre", "correo", "rol", "creadoEn", "intereses": [{ "id", "nombre" }] } }`. Sin token o con un token inválido responde `401`.

### PUT /me/intereses

```json
{
  "categoriaIds": [1, 3, 7]
}
```

Reemplaza todos los intereses por los de la lista (una lista vacía los borra todos). Responde el usuario actualizado, o `400` si alguna categoría no existe.

### GET /categorias

Responde `{ "ok": true, "categorias": [{ "id", "nombre" }] }`, ordenadas por nombre.

## Roles

El middleware `authenticate` verifica el token y deja `{ id, rol }` en `req.usuario`. Para limitar una ruta por rol se usa `requireRol`:

```ts
router.post('/eventos', authenticate, requireRol('ORGANIZADOR', 'ADMIN'), crearEvento);
```

Si el rol no corresponde, responde `403`.

## Estructura

```
src/
├── config/       → variables de entorno (validadas con zod)
├── routes/       → solo definen las rutas
├── controllers/  → reciben la petición y responden
├── services/     → lógica del negocio (Prisma solo aquí)
├── middlewares/  → autenticación, roles, validación y errores
├── validators/   → esquemas de zod
├── lib/          → cliente de Prisma, JWT y errores HTTP
├── types/        → tipos extra de Express
├── app.ts        → configuración de Express
└── index.ts      → arranque del servidor
prisma/
├── schema.prisma → modelos de la base
├── migrations/   → migraciones
└── seed.ts       → datos de ejemplo
tests/            → pruebas con vitest + supertest
```
