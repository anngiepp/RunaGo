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

Las rutas con token necesitan la cabecera `Authorization: Bearer <token>`. Las respuestas correctas vienen como `{ "ok": true, ... }` y los errores siempre como `{ "ok": false, "error": "mensaje en español" }`.

| Método | Ruta                       | Token    | Qué hace                                                        |
| ------ | -------------------------- | -------- | --------------------------------------------------------------- |
| GET    | `/health`                  | No       | Responde `{ "ok": true }`                                       |
| GET    | `/health/db`               | No       | Prueba la conexión a la base. 503 si no conecta                 |
| POST   | `/auth/registro`           | No       | Crea una cuenta de explorador u organizador                     |
| POST   | `/auth/login`              | No       | Devuelve un token y los datos del usuario                       |
| GET    | `/events`                  | Opcional | Lista eventos próximos con filtros y paginación                 |
| GET    | `/events/near`             | Opcional | Eventos cercanos a un punto, ordenados por distancia            |
| GET    | `/events/:id`              | Opcional | Detalle de un evento                                            |
| GET    | `/categories`              | No       | Lista las categorías (son los intereses)                        |
| GET    | `/districts`               | No       | Lista los distritos donde hay lugares                           |
| GET    | `/me`                      | Sí       | Datos del usuario actual con sus intereses                      |
| PATCH  | `/me`                      | Sí       | Cambia el nombre                                                |
| PUT    | `/me/interests`            | Sí       | Reemplaza los intereses del usuario                             |
| GET    | `/favorites`               | Sí       | Lista los eventos guardados                                     |
| POST   | `/favorites/:eventId`      | Sí       | Guarda un evento en favoritos                                   |
| DELETE | `/favorites/:eventId`      | Sí       | Quita un evento de favoritos                                    |
| PUT    | `/favorites/:eventId/plan` | Sí       | Agrega o quita un evento del plan de salida                     |
| GET    | `/plan`                    | Sí       | Plan de salida ordenado por fecha, con los tramos entre paradas |
| GET    | `/recommendations`         | Sí       | Los 10 eventos más recomendados para el usuario                 |

`GET /categorias` y `PUT /me/intereses` siguen funcionando con sus nombres anteriores, porque la app los usa desde el Sprint 1.

**Token opcional:** en `/events`, `/events/near` y `/events/:id`, si llega un token válido cada evento trae `esFavorito`. Sin token, o con un token inválido, responden igual pero sin ese campo.

### Cómo viene un evento

```json
{
  "id": 1,
  "titulo": "Noche de Guitarras Eléctricas Vol. 3",
  "descripcion": "...",
  "etiquetas": ["rock", "en vivo"],
  "fechaInicio": "2026-11-15T01:00:00.000Z",
  "fechaFin": "2026-11-15T04:00:00.000Z",
  "latitud": -12.1495,
  "longitud": -77.0228,
  "imagenUrl": null,
  "precioReferencia": 35,
  "categoria": { "id": 1, "nombre": "Rock" },
  "lugar": {
    "id": 7,
    "nombre": "Bajada de Baños",
    "direccion": "Bajada de Baños s/n",
    "distrito": "Barranco",
    "latitud": -12.1495,
    "longitud": -77.0228,
    "paraderoCercano": "Estación Bulevar",
    "servicioTransporte": "Metropolitano",
    "minutosAPie": 7
  },
  "organizador": { "nombre": "Colectivo Sonido Lima (prueba)" },
  "esFavorito": false
}
```

- `precioReferencia` es solo un precio **referencial** en soles (`null` = libre). RunaGo no vende entradas.
- `etiquetas` son los intereses o temas del evento, además de su `categoria`.
- La ficha de transporte del lugar (`paraderoCercano`, `servicioTransporte`, `minutosAPie`) es opcional y puede venir en `null`.

### GET /events

Solo devuelve eventos **publicados que todavía no terminan**, ordenados por fecha de inicio.

| Parámetro  | Ejemplo      | Qué hace                                                            |
| ---------- | ------------ | ------------------------------------------------------------------- |
| `page`     | `2`          | Página. Por defecto 1                                               |
| `limit`    | `10`         | Eventos por página, de 1 a 50. Por defecto 20                       |
| `category` | `4`          | Id de la categoría                                                  |
| `interest` | `jazz`       | Nombre de una categoría o una etiqueta (sin distinguir mayúsculas)  |
| `district` | `Barranco`   | Distrito del lugar (sin distinguir mayúsculas)                      |
| `q`        | `trivia`     | Busca en el título, la descripción y las etiquetas                  |
| `from`     | `2026-11-20` | Desde ese día (hora de Lima). También acepta una fecha ISO completa |
| `to`       | `2026-11-25` | Hasta ese día, incluido (hora de Lima)                              |

Ejemplos:

```
GET /events
GET /events?page=2&limit=10
GET /events?category=4
GET /events?interest=jazz&district=Barranco
GET /events?q=feria
GET /events?from=2026-11-20&to=2026-11-25
```

Responde `{ "ok": true, "eventos": [...], "pagina": 1, "porPagina": 20, "total": 30, "totalPaginas": 2 }`.

### GET /events/near

```
GET /events/near?lat=-12.1495&lng=-77.0228
GET /events/near?lat=-12.1495&lng=-77.0228&radiusKm=10
```

- `lat` y `lng` son obligatorios. `radiusKm` va de 0.1 a 50 y por defecto es 5.
- Cada evento trae `distanciaKm` en línea recta (fórmula de Haversine), y vienen del más cercano al más lejano.
- Responde `{ "ok": true, "eventos": [...], "radioKm": 5, "total": 6 }`. Si las coordenadas no son válidas, responde `400`.

### GET /events/:id

```
GET /events/1
```

Responde `{ "ok": true, "evento": {...} }` con todos los datos del evento y además `resenas: { promedio, total }`. Si no existe o está oculto, responde `404` con `"No encontramos ese evento"`.

### GET /categories y GET /districts

```
GET /categories   → { "ok": true, "categorias": [{ "id", "nombre" }] }
GET /districts    → { "ok": true, "distritos": ["Barranco", "Cercado de Lima", ...] }
```

### PATCH /me

```json
{ "nombre": "Micaela Ríos" }
```

Responde el perfil actualizado. El nombre debe tener entre 2 y 80 caracteres.

### PUT /me/interests

```json
{ "categoriaIds": [1, 3, 7] }
```

Reemplaza todos los intereses por los de la lista (una lista vacía los borra todos). Responde el usuario actualizado, o `400` si alguna categoría no existe.

### Favoritos

```
POST   /favorites/12   → 201 { "ok": true, "favorito": { "eventoId": 12, "enPlan": false, "guardadoEn": "..." } }
DELETE /favorites/12   → { "ok": true }
GET    /favorites      → { "ok": true, "favoritos": [...], "total": 3 }
```

- Guardar dos veces el mismo evento no lo duplica. Si el evento no existe, responde `404`.
- Quitar un evento que no estaba guardado también responde `ok`.
- En `GET /favorites`, cada evento trae `enPlan` y `guardadoEn`. Vienen del más reciente al más antiguo.

### Plan de salida

```
PUT /favorites/12/plan
{ "enPlan": true }
```

Agregar un evento al plan también lo guarda en favoritos. Con `{ "enPlan": false }` sale del plan pero sigue en favoritos.

```
GET /plan
```

```json
{
  "ok": true,
  "paradas": [
    { "id": 1, "...": "..." },
    { "id": 5, "...": "..." }
  ],
  "tramos": [
    {
      "desdeEventoId": 1,
      "hastaEventoId": 5,
      "distanciaKm": 11.48,
      "minutos": 35,
      "modo": "TRANSPORTE_PUBLICO"
    }
  ],
  "minutosTotales": 35
}
```

- Las paradas son los eventos con `enPlan: true` que todavía no terminan, ordenados por fecha.
- Hay un tramo entre cada par de paradas seguidas.
- **Supuestos para estimar los tramos:**
  - la distancia es en línea recta (Haversine), no por calles
  - menos de 1 km se camina a **5 km/h** (`modo: "A_PIE"`)
  - desde 1 km se va en transporte público a unos **20 km/h** (`modo: "TRANSPORTE_PUBLICO"`)
  - los minutos se redondean hacia arriba, con un mínimo de 1

  Son tiempos estimados, como avisa la pantalla del plan.

### GET /recommendations

```
GET /recommendations
GET /recommendations?lat=-12.1495&lng=-77.0228
```

Recomendador propio basado en contenido (sin IA externa), en `src/services/recommender.service.ts`. Por ahora está disponible para todos los usuarios con sesión. Revisa los eventos próximos y les da un puntaje:

| Parte                       | Puntos                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------- |
| Intereses en común          | 3 por cada interés del usuario que coincide con la categoría o una etiqueta del evento |
| Cercanía (si hay ubicación) | De 3 (a 0 km) a 0 (a 20 km o más)                                                      |
| Cercanía de la fecha        | De 2 (hoy) a 0 (en 30 días o más)                                                      |

- Las coincidencias no distinguen mayúsculas ni tildes ("Electrónica" = "electronica").
- Devuelve los 10 mejores con `puntaje`, `motivo` (por ejemplo `"Coincide con: rock, indie"`, `"Está cerca de ti"` o `"Es pronto"`), `distanciaKm` si enviaste ubicación y `esFavorito`.
- `lat` y `lng` son opcionales, pero deben ir juntos.

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
