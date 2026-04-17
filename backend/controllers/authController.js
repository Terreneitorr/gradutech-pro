const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

/**
 * Registro de usuario
 * -------------------
 * El rol SIEMPRE se asigna como USUARIO automáticamente.
 * Nadie puede mandarse un rol desde el body (ni AGENCIA ni ADMIN).
 * El rol AGENCIA se asigna únicamente desde el endpoint de registro de agencia.
 * El rol ADMIN solo se asigna manualmente directo en la base de datos.
 */
const registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    // ⚠️ El campo "rol" se ignora aunque venga en el body — nunca se lee

    // Validaciones básicas
    if (!nombre) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }
    if (!email) {
      return res.status(400).json({ error: "El email es obligatorio" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "El formato del email no es válido" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ error: 'Email ya registrado' });

    const hash = await bcrypt.hash(password, 10);
    const usuario = await prisma.usuario.create({
      // El rol siempre es USUARIO — no se acepta del body
      data: { nombre, email, password: hash, rol: 'USUARIO' }
    });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Login de usuario
 * ----------------
 * Valida credenciales y devuelve token JWT con el rol real del usuario en BD.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(400).json({ error: 'Credenciales invalidas' });

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(400).json({ error: 'Credenciales invalidas' });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registro, login };