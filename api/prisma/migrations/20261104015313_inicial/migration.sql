-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('EXPLORADOR', 'ORGANIZADOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "EstadoEvento" AS ENUM ('PUBLICADO', 'OCULTO');

-- CreateEnum
CREATE TYPE "PlanMembresia" AS ENUM ('EXPLORADOR_PREMIUM', 'ORGANIZADOR_BASICO', 'ORGANIZADOR_PRO');

-- CreateEnum
CREATE TYPE "EstadoMembresia" AS ENUM ('ACTIVA', 'VENCIDA', 'CANCELADA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena_hash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'EXPLORADOR',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lugares" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "distrito" TEXT NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "lugares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" SERIAL NOT NULL,
    "organizador_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "lugar_id" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "etiquetas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "imagen_url" TEXT,
    "precio_referencia" DECIMAL(8,2),
    "estado" "EstadoEvento" NOT NULL DEFAULT 'PUBLICADO',

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoritos" (
    "usuario_id" INTEGER NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "guardado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("usuario_id","evento_id")
);

-- CreateTable
CREATE TABLE "intereses_usuario" (
    "usuario_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,

    CONSTRAINT "intereses_usuario_pkey" PRIMARY KEY ("usuario_id","categoria_id")
);

-- CreateTable
CREATE TABLE "membresias" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "plan" "PlanMembresia" NOT NULL,
    "estado" "EstadoMembresia" NOT NULL DEFAULT 'ACTIVA',
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,

    CONSTRAINT "membresias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resenas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "creada_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resenas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fotos" (
    "id" SERIAL NOT NULL,
    "resena_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "fotos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE INDEX "eventos_fecha_inicio_idx" ON "eventos"("fecha_inicio");

-- CreateIndex
CREATE INDEX "eventos_categoria_id_idx" ON "eventos"("categoria_id");

-- CreateIndex
CREATE INDEX "eventos_lugar_id_idx" ON "eventos"("lugar_id");

-- CreateIndex
CREATE INDEX "resenas_evento_id_idx" ON "resenas"("evento_id");

-- CreateIndex
CREATE UNIQUE INDEX "resenas_usuario_id_evento_id_key" ON "resenas"("usuario_id", "evento_id");

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_organizador_id_fkey" FOREIGN KEY ("organizador_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_lugar_id_fkey" FOREIGN KEY ("lugar_id") REFERENCES "lugares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intereses_usuario" ADD CONSTRAINT "intereses_usuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intereses_usuario" ADD CONSTRAINT "intereses_usuario_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membresias" ADD CONSTRAINT "membresias_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotos" ADD CONSTRAINT "fotos_resena_id_fkey" FOREIGN KEY ("resena_id") REFERENCES "resenas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- La calificación de una reseña va de 1 a 5
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_calificacion_check" CHECK ("calificacion" BETWEEN 1 AND 5);

-- Bloquea el acceso directo desde la Data API de Supabase (la API usa Prisma)
ALTER TABLE "usuarios" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categorias" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lugares" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "eventos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "favoritos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "intereses_usuario" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "membresias" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "resenas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fotos" ENABLE ROW LEVEL SECURITY;
