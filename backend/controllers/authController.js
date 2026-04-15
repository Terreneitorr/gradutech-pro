const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const registro = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ error: 'Email ya registrado' });
    const hash = await bcrypt.hash(password, 10);
    const usuario = await prisma.usuario.create({
      data: { nombre, email, password: hash, rol: rol || 'USUARIO' }
    });
    const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(400).json({ error: 'Credenciales invalidas' });
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(400).json({ error: 'Credenciales invalidas' });
    const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registro, login };