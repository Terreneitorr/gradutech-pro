/**
 * Archivo principal del servidor Express
 * -------------------------------------
 * Inicializa la aplicación backend de GraduTech Pro.
 * 
 * Responsabilidades:
 * - Configurar middlewares globales
 * - Registrar rutas del sistema
 * - Conectar con Prisma ORM
 * - Iniciar servidor HTTP
 * 
 * Puerto por defecto: 3000
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/pagos/webhook', express.raw({ type: 'application/json' }));

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/agencias', require('./routes/agencias'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/modelos', require('./routes/modelos'));
app.use('/api/pagos', require('./routes/pagos'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'GraduTech Pro API funcionando' });
});

// Middleware global de manejo de errores
// Debe ir al final de todas las rutas para capturar errores no manejados
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Servidor corriendo en puerto ' + PORT);
});