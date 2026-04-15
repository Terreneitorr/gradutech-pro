const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crearPedido = async (req, res) => {
  try {
    const { agenciaId, paqueteId, escuela, grado, leyenda, totalPago } = req.body;
    const pedido = await prisma.pedido.create({
      data: {
        usuarioId: req.usuario.id,
        agenciaId,
        paqueteId,
        escuela,
        grado,
        leyenda,
        totalPago
      },
      include: { agencia: true, paquete: true, usuario: true }
    });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const misPedidos = async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { usuarioId: req.usuario.id },
      include: { agencia: true, paquete: true }
    });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const pedidosPorAgencia = async (req, res) => {
  try {
    const { agenciaId } = req.params;
    const pedidos = await prisma.pedido.findMany({
      where: { agenciaId },
      include: { usuario: true, paquete: true }
    });
    const grupos = pedidos.reduce((acc, pedido) => {
      const key = pedido.escuela + '-' + pedido.grado;
      if (!acc[key]) acc[key] = [];
      acc[key].push(pedido);
      return acc;
    }, {});
    res.json({ pedidos, grupos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const pedido = await prisma.pedido.update({
      where: { id },
      data: { estado }
    });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { crearPedido, misPedidos, pedidosPorAgencia, actualizarEstado };