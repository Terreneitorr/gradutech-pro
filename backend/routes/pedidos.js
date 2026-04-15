const express = require('express');
const router = express.Router();
const { crearPedido, misPedidos, pedidosPorAgencia, actualizarEstado } = require('../controllers/pedidoController');
const { verificarToken, soloAgencia } = require('../middlewares/auth');

router.post('/', verificarToken, crearPedido);
router.get('/mis-pedidos', verificarToken, misPedidos);
router.get('/agencia/:agenciaId', verificarToken, soloAgencia, pedidosPorAgencia);
router.put('/:id/estado', verificarToken, soloAgencia, actualizarEstado);

module.exports = router;