-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('USUARIO', 'AGENCIA', 'ADMIN');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'EN_PRODUCCION', 'LISTO', 'ENTREGADO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'USUARIO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agencia" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "logo" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT false,
    "suscripcion" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paquete" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "agenciaId" TEXT NOT NULL,

    CONSTRAINT "Paquete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "agenciaId" TEXT NOT NULL,
    "paqueteId" TEXT NOT NULL,
    "escuela" TEXT NOT NULL,
    "grado" TEXT NOT NULL,
    "leyenda" TEXT NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE',
    "totalPago" DOUBLE PRECISION NOT NULL,
    "anticipoPagado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FechaDisponible" (
    "id" TEXT NOT NULL,
    "agenciaId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "cupos" INTEGER NOT NULL,

    CONSTRAINT "FechaDisponible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publicidad" (
    "id" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "imagen" TEXT,
    "link" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Publicidad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agencia_slug_key" ON "Agencia"("slug");

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_agenciaId_fkey" FOREIGN KEY ("agenciaId") REFERENCES "Agencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_agenciaId_fkey" FOREIGN KEY ("agenciaId") REFERENCES "Agencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_paqueteId_fkey" FOREIGN KEY ("paqueteId") REFERENCES "Paquete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FechaDisponible" ADD CONSTRAINT "FechaDisponible_agenciaId_fkey" FOREIGN KEY ("agenciaId") REFERENCES "Agencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
