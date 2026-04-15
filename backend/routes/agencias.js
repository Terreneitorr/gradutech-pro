const express = require('express');
const router = express.Router();
const { listarAgencias, obtenerAgencia, crearAgencia, actualizarAgencia } = require('../controllers/agenciaController');
const { verificarToken, soloAdmin, soloAgencia } = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', listarAgencias);

router.get('/todas', verificarToken, async (req, res) => {
  try {
    const agencias = await prisma.agencia.findMany({
      include: { paquetes: true, fechas: true }
    });
    res.json(agencias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    const agencia = await prisma.agencia.findUnique({
      where: { id: req.params.id },
      include: { paquetes: true, fechas: true }
    });
    if (!agencia) return res.status(404).json({ error: 'No encontrada' });
    res.json(agencia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug', obtenerAgencia);
router.post('/', verificarToken, crearAgencia);
router.put('/:id', verificarToken, soloAgencia, actualizarAgencia);

router.post('/:id/paquetes', verificarToken, async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    const paquete = await prisma.paquete.create({
      data: { nombre, descripcion, precio: parseFloat(precio), agenciaId: req.params.id }
    });
    res.json(paquete);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/paquetes/:paqueteId', verificarToken, async (req, res) => {
  try {
    await prisma.paquete.delete({ where: { id: req.params.paqueteId } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/fechas', verificarToken, async (req, res) => {
  try {
    const { fecha, cupos } = req.body;
    const f = await prisma.fechaDisponible.create({
      data: { agenciaId: req.params.id, fecha: new Date(fecha), cupos: parseInt(cupos) }
    });
    res.json(f);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/fechas/:fechaId', verificarToken, async (req, res) => {
  try {
    await prisma.fechaDisponible.delete({ where: { id: req.params.fechaId } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;