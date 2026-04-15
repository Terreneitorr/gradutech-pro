const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const listarAgencias = async (req, res) => {
  try {
    const agencias = await prisma.agencia.findMany({
      where: { activa: true, suscripcion: true },
      include: { paquetes: true }
    });
    res.json(agencias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const obtenerAgencia = async (req, res) => {
  try {
    const { slug } = req.params;
    const agencia = await prisma.agencia.findUnique({
      where: { slug },
      include: { paquetes: true, fechas: true }
    });
    if (!agencia) return res.status(404).json({ error: 'Agencia no encontrada' });
    res.json(agencia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const crearAgencia = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const slug = nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const agencia = await prisma.agencia.create({
      data: { nombre, slug, descripcion, usuarioId: req.usuario.id }
    });
    res.json(agencia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const actualizarAgencia = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    const agencia = await prisma.agencia.update({
      where: { id },
      data: datos
    });
    res.json(agencia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { listarAgencias, obtenerAgencia, crearAgencia, actualizarAgencia };