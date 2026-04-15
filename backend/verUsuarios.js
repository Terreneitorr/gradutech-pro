const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      createdAt: true,
    }
  });
  console.log('\n=== USUARIOS REGISTRADOS ===\n');
  usuarios.forEach(u => {
    console.log(`Nombre: ${u.nombre}`);
    console.log(`Email:  ${u.email}`);
    console.log(`Rol:    ${u.rol}`);
    console.log(`Fecha:  ${u.createdAt.toLocaleDateString('es-MX')}`);
    console.log('---');
  });
  console.log(`\nTotal: ${usuarios.length} usuarios\n`);
  await prisma.$disconnect();
}

main().catch(console.error);