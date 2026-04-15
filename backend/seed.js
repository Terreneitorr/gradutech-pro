const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const agencia = await prisma.agencia.create({
    data: {
      nombre: 'Estudio Foto Chiapas',
      slug: 'foto-chiapas',
      descripcion: 'Especialistas en fotografía de graduación en Chiapas',
      activa: true,
      suscripcion: true,
      paquetes: {
        create: [
          { nombre: 'Paquete Plata', descripcion: '1 cuadro 30x40, 10 fotos digitales', precio: 1500 },
          { nombre: 'Paquete Oro', descripcion: '2 cuadros, 20 fotos digitales, album', precio: 2500 },
          { nombre: 'Paquete Diamante', descripcion: '3 cuadros, fotos ilimitadas, video', precio: 4000 },
        ]
      }
    }
  });
  console.log('Agencia creada:', agencia.nombre);
  await prisma.$disconnect();
}

main().catch(console.error);