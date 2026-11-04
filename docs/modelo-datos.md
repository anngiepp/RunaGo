# Modelo de datos de RunaGo

El modelo está definido con Prisma en `api/prisma/schema.prisma` y parte del diagrama entidad-relación (`docs/er-runago.mmd`).

Los modelos usan nombres en español sin tildes. En la base, las tablas y columnas van en plural y snake_case, igual que en el diagrama (por ejemplo, `Usuario.contrasenaHash` → `usuarios.contrasena_hash`).

## Usuario (`usuarios`)

| Campo          | Tipo                                         | Notas                    |
| -------------- | -------------------------------------------- | ------------------------ |
| id             | Int                                          | PK, autoincremental      |
| nombre         | String                                       |                          |
| correo         | String                                       | Único                    |
| contrasenaHash | String                                       | Hash con bcrypt          |
| rol            | Enum: `EXPLORADOR` · `ORGANIZADOR` · `ADMIN` | Por defecto `EXPLORADOR` |
| creadoEn       | DateTime                                     | Fecha de registro        |

**Relaciones:** publica muchos `Evento` (como organizador), tiene muchos `Favorito`, `InteresUsuario`, `Membresia` y `Resena`. Si se borra un usuario, se borran sus eventos, favoritos, intereses, membresías y reseñas.

## Categoria (`categorias`)

| Campo  | Tipo   | Notas               |
| ------ | ------ | ------------------- |
| id     | Int    | PK, autoincremental |
| nombre | String | Único               |

Las categorías también son los intereses de los usuarios (géneros, subculturas y tipos de evento).

**Relaciones:** clasifica muchos `Evento` y aparece en muchos `InteresUsuario`. No se puede borrar una categoría que tenga eventos.

## Lugar (`lugares`)

| Campo     | Tipo   | Notas               |
| --------- | ------ | ------------------- |
| id        | Int    | PK, autoincremental |
| nombre    | String |                     |
| direccion | String |                     |
| distrito  | String |                     |
| latitud   | Float  |                     |
| longitud  | Float  |                     |

**Relaciones:** aloja muchos `Evento`. No se puede borrar un lugar que tenga eventos.

## Evento (`eventos`)

| Campo            | Tipo                         | Notas                                              |
| ---------------- | ---------------------------- | -------------------------------------------------- |
| id               | Int                          | PK, autoincremental                                |
| organizadorId    | Int                          | FK → Usuario                                       |
| categoriaId      | Int                          | FK → Categoria                                     |
| lugarId          | Int                          | FK → Lugar                                         |
| titulo           | String                       |                                                    |
| descripcion      | String                       |                                                    |
| etiquetas        | String[]                     | Lista de texto, por defecto vacía                  |
| fechaInicio      | DateTime                     |                                                    |
| fechaFin         | DateTime?                    | Opcional                                           |
| latitud          | Float                        |                                                    |
| longitud         | Float                        |                                                    |
| imagenUrl        | String?                      | Opcional                                           |
| precioReferencia | Decimal(8,2)?                | Opcional, solo informativo (no se venden entradas) |
| estado           | Enum: `PUBLICADO` · `OCULTO` | Por defecto `PUBLICADO`                            |

**Relaciones:** pertenece a un `Usuario` (organizador), una `Categoria` y un `Lugar`. Tiene muchos `Favorito` y `Resena`, que se borran si se borra el evento.

**Índices:** `fechaInicio`, `categoriaId`, `lugarId`.

## Favorito (`favoritos`)

| Campo      | Tipo     | Notas                      |
| ---------- | -------- | -------------------------- |
| usuarioId  | Int      | PK compuesta, FK → Usuario |
| eventoId   | Int      | PK compuesta, FK → Evento  |
| guardadoEn | DateTime | Fecha en que se guardó     |

## InteresUsuario (`intereses_usuario`)

| Campo       | Tipo | Notas                        |
| ----------- | ---- | ---------------------------- |
| usuarioId   | Int  | PK compuesta, FK → Usuario   |
| categoriaId | Int  | PK compuesta, FK → Categoria |

## Membresia (`membresias`)

| Campo       | Tipo                                                                  | Notas                |
| ----------- | --------------------------------------------------------------------- | -------------------- |
| id          | Int                                                                   | PK, autoincremental  |
| usuarioId   | Int                                                                   | FK → Usuario         |
| plan        | Enum: `EXPLORADOR_PREMIUM` · `ORGANIZADOR_BASICO` · `ORGANIZADOR_PRO` |                      |
| estado      | Enum: `ACTIVA` · `VENCIDA` · `CANCELADA`                              | Por defecto `ACTIVA` |
| fechaInicio | Date                                                                  |                      |
| fechaFin    | Date                                                                  |                      |

Los pagos son simulados (Stripe en modo test); aquí solo se guarda el resultado.

## Resena (`resenas`)

| Campo        | Tipo     | Notas                                     |
| ------------ | -------- | ----------------------------------------- |
| id           | Int      | PK, autoincremental                       |
| usuarioId    | Int      | FK → Usuario                              |
| eventoId     | Int      | FK → Evento                               |
| calificacion | Int      | De 1 a 5 (restricción `CHECK` en la base) |
| comentario   | String   |                                           |
| creadaEn     | DateTime | Fecha de creación                         |

**Restricción única:** un usuario solo puede dejar una reseña por evento (`usuarioId` + `eventoId`).

**Índices:** `eventoId`.

**Relaciones:** tiene muchas `Foto`, que se borran si se borra la reseña.

## Foto (`fotos`)

| Campo    | Tipo   | Notas               |
| -------- | ------ | ------------------- |
| id       | Int    | PK, autoincremental |
| resenaId | Int    | FK → Resena         |
| url      | String |                     |

## Seguridad en Supabase

La migración inicial activa RLS (Row Level Security) en todas las tablas. Así nadie puede leerlas directamente con la clave anónima de Supabase; todo pasa por la API, que se conecta con Prisma.

## Datos de ejemplo (seed)

`npm run db:seed` crea 15 categorías, 8 lugares de Lima (coordenadas aproximadas), 30 eventos ficticios con fechas en los próximos 30 días, 1 administrador (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) y 2 organizadores de prueba (`organizador1@runago.test` y `organizador2@runago.test`).

Se puede correr varias veces sin duplicar datos. La contraseña de los organizadores sale de `ORGANIZADOR_PASSWORD` o, si no existe, se genera al azar y se muestra una sola vez en la consola, al crearlos.

## Recrear todo desde cero

Desde `api/`:

```bash
npx prisma migrate reset   # borra la base, vuelve a aplicar las migraciones
npm run db:seed            # carga los datos de ejemplo
```

⚠️ `migrate reset` borra **todos** los datos de la base a la que apunta `DIRECT_URL`.

Para aplicar cambios nuevos del schema durante el desarrollo:

```bash
npm run db:migrate -- --name nombre_del_cambio
```
