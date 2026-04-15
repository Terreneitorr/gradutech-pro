const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { verificarToken } = require('../middlewares/auth');
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/modelos/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.random().toString(36).substr(2,9) + ext);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/subir', verificarToken, upload.single('imagen'), async (req, res) => {
  try {
    const { agenciaId, nombre, tipo } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No se subio imagen' });
    const modelo = await prisma.modeloCuadro.create({
      data: { agenciaId, nombre, tipo, imagen: '/uploads/modelos/' + req.file.filename }
    });
    res.json(modelo);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/agencia/:agenciaId', async (req, res) => {
  try {
    const modelos = await prisma.modeloCuadro.findMany({ where: { agenciaId: req.params.agenciaId } });
    res.json(modelos);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', verificarToken, async (req, res) => {
  try {
    await prisma.modeloCuadro.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;