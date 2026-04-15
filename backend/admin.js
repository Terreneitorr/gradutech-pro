const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Admin GraduTech',
      email: 'admin@gradutech.com',
      password: hash,
      rol: 'ADMIN'
    }
  });
  console.log('Admin creado:', admin.email);
  await prisma.$disconnect();
}

main().catch(console.error);