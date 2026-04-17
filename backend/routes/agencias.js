const express = require('express');
const router = express.Router();
const { listarAgencias, obtenerAgencia, crearAgencia, actualizarAgencia } = require('../controllers/agenciaController');
const { verificarToken, soloAdmin, soloAgencia } = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Público — cualquiera puede ver agencias activas en el directorio
router.get('/', listarAgencias);

// ✅ PROTEGIDO — solo ADMIN puede ver TODAS las agencias (incluyendo inactivas)
router.get('/todas', verificarToken, soloAdmin, async (req, res) => {
  try {
    const agencias = await prisma.agencia.findMany({
      include: { paquetes: true, fechas: true }
    });
    res.json(agencias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Público — ver agencia por ID
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

// Público — ver agencia por slug
router.get('/:slug', obtenerAgencia);

// ✅ PROTEGIDO — crear agencia requiere token
router.post('/', verificarToken, crearAgencia);

// ✅ PROTEGIDO — actualizar agencia: solo la propia agencia o admin
router.put('/:id', verificarToken, soloAgencia, actualizarAgencia);

// ✅ PROTEGIDO — agregar paquete a agencia
router.post('/:id/paquetes', verificarToken, soloAgencia, async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }
    if (parseFloat(precio) <= 0) {
      return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
    }
    const paquete = await prisma.paquete.create({
      data: { nombre, descripcion, precio: parseFloat(precio), agenciaId: req.params.id }
    });
    res.json(paquete);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PROTEGIDO — eliminar paquete
router.delete('/paquetes/:paqueteId', verificarToken, soloAgencia, async (req, res) => {
  try {
    await prisma.paquete.delete({ where: { id: req.params.paqueteId } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PROTEGIDO — agregar fecha disponible
router.post('/:id/fechas', verificarToken, soloAgencia, async (req, res) => {
  try {
    const { fecha, cupos } = req.body;
    if (!fecha || !cupos) {
      return res.status(400).json({ error: 'Fecha y cupos son obligatorios' });
    }
    if (parseInt(cupos) <= 0) {
      return res.status(400).json({ error: 'Los cupos deben ser mayor a 0' });
    }
    const f = await prisma.fechaDisponible.create({
      data: { agenciaId: req.params.id, fecha: new Date(fecha), cupos: parseInt(cupos) }
    });
    res.json(f);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PROTEGIDO — eliminar fecha
router.delete('/fechas/:fechaId', verificarToken, soloAgencia, async (req, res) => {
  try {
    await prisma.fechaDisponible.delete({ where: { id: req.params.fechaId } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;