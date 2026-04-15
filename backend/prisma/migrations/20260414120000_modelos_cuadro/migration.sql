-- CreateEnum
CREATE TYPE "TipoCuadro" AS ENUM ('MARCO', 'FONDO', 'DISENO');

-- CreateTable
CREATE TABLE "ModeloCuadro" (
    "id" TEXT NOT NULL,
    "agenciaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoCuadro" NOT NULL,
    "imagen" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModeloCuadro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ModeloCuadro" ADD CONSTRAINT "ModeloCuadro_agenciaId_fkey" FOREIGN KEY ("agenciaId") REFERENCES "Agencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
