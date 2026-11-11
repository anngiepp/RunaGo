-- AlterTable
ALTER TABLE "favoritos" ADD COLUMN     "en_plan" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "lugares" ADD COLUMN     "minutos_a_pie" INTEGER,
ADD COLUMN     "paradero_cercano" TEXT,
ADD COLUMN     "servicio_transporte" TEXT;
