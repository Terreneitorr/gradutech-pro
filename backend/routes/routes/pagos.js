const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const { verificarToken } = require('../middlewares/auth');
const prisma = new PrismaClient();

// Crear sesión de pago para anticipo de pedido
router.post('/anticipo', verificarToken, async (req, res) => {
  try {
    const { pedidoId } = req.body;
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: { agencia: true, paquete: true, usuario: true }
    });
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    const anticipo = Math.round(pedido.totalPago * 0.3);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'mxn',
          product_data: {
            name: `Anticipo — ${pedido.paquete.nombre}`,
            description: `${pedido.agencia.nombre} — ${pedido.escuela}`,
          },
          unit_amount: anticipo * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/pago-exitoso?pedido=${pedidoId}&tipo=anticipo`,
      cancel_url: `${process.env.FRONTEND_URL}/mis-pedidos`,
      metadata: { pedidoId, tipo: 'anticipo' }
    });
    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear sesión de suscripción para agencia
router.post('/suscripcion', verificarToken, async (req, res) => {
  try {
    const { plan } = req.body;
    const precios = {
      basico:  { amount: 29900,  nombre: 'Plan Básico — GraduTech Pro' },
      pro:     { amount: 59900,  nombre: 'Plan Pro — GraduTech Pro' },
      anual:   { amount: 499900, nombre: 'Plan Anual — GraduTech Pro' },
    };
    const precio = precios[plan as keyof typeof precios] || precios.pro;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'mxn',
          product_data: { name: precio.nombre },
          unit_amount: precio.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/agencia/bienvenida?suscripcion=ok`,
      cancel_url: `${process.env.FRONTEND_URL}/agencia/registro`,
      metadata: { usuarioId: req.usuario.id, plan, tipo: 'suscripcion' }
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook de Stripe para confirmar pagos
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    return res.status(400).json({ error: 'Webhook error' });
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    if (session.metadata.tipo === 'anticipo') {
      await prisma.pedido.update({
        where: { id: session.metadata.pedidoId },
        data: { anticipoPagado: true, estado: 'CONFIRMADO' }
      });
    }
    if (session.metadata.tipo === 'suscripcion') {
      const agencia = await prisma.agencia.findFirst({
        where: { usuarioId: session.metadata.usuarioId }
      });
      if (agencia) {
        await prisma.agencia.update({
          where: { id: agencia.id },
          data: { suscripcion: true, activa: true }
        });
      }
    }
  }
  res.json({ received: true });
});

module.exports = router;