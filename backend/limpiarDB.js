const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.pedido.deleteMany();
  await prisma.fechaDisponible.deleteMany();
  await prisma.paquete.deleteMany();
  await prisma.agencia.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.publicidad.deleteMany();
  console.log('Base de datos limpia');
  await prisma.$disconnect();
}

main().catch(console.error);