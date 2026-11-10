# RunaGo

Plataforma web y Android para descubrir eventos, lugares y experiencias en Perú, con un botón "Cómo llegar" que te lleva en transporte público.

Proyecto de titulación (línea StartUp) de Tecsup.

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

## Cómo levantar el proyecto desde cero

Pasos para un PC nuevo. Los comandos funcionan en PowerShell y en Git Bash, salvo donde se indica.

### 0. Lo que necesitas

- [Node.js](https://nodejs.org/) 22 LTS o superior y [Git](https://git-scm.com/)
- Un proyecto en [Supabase](https://supabase.com/) (plan gratuito) para la base de datos
- Para probar en el celular: un Android con **Expo Go** (Play Store)

### 1. Clonar el repo

```bash
git clone https://github.com/anngiepp/RunaGo.git
cd RunaGo
git checkout develop
```

### 2. Instalar dependencias (raíz, api y app)

```bash
npm install
cd api
npm install
cd ../app
npm install
cd ..
```

La raíz instala ESLint y Prettier. En `api/`, al instalar se genera el cliente de Prisma.

### 3. Crear los archivos `.env`

Cada carpeta tiene un `.env.example` sin valores reales. Cópialo como `.env`:

```powershell
# PowerShell
Copy-Item api/.env.example api/.env
Copy-Item app/.env.example app/.env
```

```bash
# Git Bash
cp api/.env.example api/.env
cp app/.env.example app/.env
```

Luego completa `api/.env`:

- `DATABASE_URL` y `DIRECT_URL`: en Supabase, botón **Connect** → copia la cadena del _Transaction pooler_ (puerto 6543) en `DATABASE_URL` y la del _Session pooler_ (puerto 5432) en `DIRECT_URL`, con tu contraseña de la base.
- `JWT_SECRET`: genera uno con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- `ADMIN_EMAIL` y `ADMIN_PASSWORD`: el administrador que crea el seed.

`app/.env` ya viene con `EXPO_PUBLIC_API_URL=http://localhost:3000`, que sirve para el navegador. Los `.env` nunca se suben a git. La tabla completa de variables está en `api/README.md` y `app/README.md`.

### 4. Migraciones y datos de ejemplo

```bash
cd api
npx prisma migrate deploy   # crea las tablas en Supabase
npm run db:seed             # categorías, lugares, eventos de ejemplo, admin y organizadores de prueba
```

El seed se puede correr varias veces: actualiza lo que ya existe en vez de duplicarlo. Si no pusiste `ORGANIZADOR_PASSWORD`, la contraseña de los organizadores de prueba aparece una sola vez en la consola.

### 5. Levantar la API

En una terminal, dentro de `api/`:

```bash
npm run dev
```

Revisa que responda en http://localhost:3000/health y que http://localhost:3000/health/db diga que conecta.

### 6. Levantar la app

En otra terminal, dentro de `app/`:

```bash
npx expo start --clear
```

- **En el navegador:** presiona `w`. Se abre en http://localhost:8081.
- **En el celular (Android con Expo Go):**
  1. Conecta el celular a la **misma red Wi-Fi** que el PC.
  2. Busca la IP del PC: en Windows corre `ipconfig` y copia la "Dirección IPv4" del adaptador Wi-Fi.
  3. En `app/.env` cambia `localhost` por esa IP, por ejemplo `EXPO_PUBLIC_API_URL=http://192.168.1.10:3000`. En el celular `localhost` apunta al propio celular, por eso no funciona.
  4. Reinicia con `npx expo start --clear` y escanea el QR desde Expo Go.
  5. Si Windows pregunta por el firewall para Node.js, permite el acceso en **redes privadas**. Si la red (por ejemplo, la de la universidad) no deja conectar, prueba `npx expo start --tunnel`.

Después de probar en el celular, vuelve a poner `localhost` si usas el navegador.

### 7. Probar que todo funciona

- Flujo: **Crear cuenta → elegir intereses → Explorar → "Cómo llegar" (prueba temporal) → Perfil → Cerrar sesión → Iniciar sesión**.
- Pruebas y revisiones:

```bash
# en la raíz
npm run lint
npm run format:check

# en api/
npm test

# en app/
npm test
npx tsc --noEmit
npx expo export -p web
```

Las pruebas de `api/` no usan la base real.
