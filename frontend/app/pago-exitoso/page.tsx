'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function PagoExitoso() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [procesando, setProcesando] = useState(true);
  const tipo = searchParams.get('tipo');
  const pedidoId = searchParams.get('pedido');

  useEffect(() => {
    setTimeout(() => setProcesando(false), 2000);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{background:'#0f0c29'}}>
      <div style={{position:'absolute', top:'20%', left:'30%', width:400, height:400, borderRadius:'50%', background:'rgba(74,222,128,0.1)', filter:'blur(80px)'}}/>
      <div className="relative z-10 text-center max-w-md">
        {procesando ? (
          <div>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{background:'rgba(240,147,251,0.2)', border:'2px solid #f093fb'}}>
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{borderColor:'#f093fb', borderTopColor:'transparent'}}/>
            </div>
            <p className="text-white text-xl font-bold">Procesando pago...</p>
          </div>
        ) : (
          <div>
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-8"
              style={{background:'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(52,211,153,0.2))', border:'2px solid #4ade80'}}>
              ✓
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">¡Pago exitoso!</h1>
            <p className="text-lg mb-8" style={{color:'rgba(255,255,255,0.5)'}}>
              {tipo === 'anticipo'
                ? 'Tu anticipo fue procesado. Tu lugar está confirmado.'
                : 'Tu suscripción fue activada. Ya puedes aparecer en el directorio.'}
            </p>
            <div className="rounded-2xl p-6 mb-8 text-left" style={{background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)'}}>
              <p className="text-sm font-bold mb-3" style={{color:'#4ade80'}}>¿Qué sigue?</p>
              {tipo === 'anticipo' ? (
                <div className="space-y-2 text-sm" style={{color:'rgba(255,255,255,0.6)'}}>
                  <p>✓ Recibirás confirmación por correo</p>
                  <p>✓ La agencia coordinará tu fecha de sesión</p>
                  <p>✓ El pago restante se hace el día de la sesión</p>
                </div>
              ) : (
                <div className="space-y-2 text-sm" style={{color:'rgba(255,255,255,0.6)'}}>
                  <p>✓ Tu agencia ya aparece en el directorio</p>
                  <p>✓ Agrega tus paquetes desde el panel</p>
                  <p>✓ Comparte tu link único con tus clientes</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-center">
              {tipo === 'anticipo' ? (
                <>
                  <button onClick={() => router.push('/mis-pedidos')}
                    className="px-6 py-3 rounded-xl font-bold text-white"
                    style={{background:'linear-gradient(135deg, #f093fb, #f5576c)'}}>
                    Ver mis pedidos
                  </button>
                  <button onClick={() => router.push('/')}
                    className="px-6 py-3 rounded-xl font-medium text-white"
                    style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)'}}>
                    Ir al inicio
                  </button>
                </>
              ) : (
                <button onClick={() => router.push('/dashboard')}
                  className="px-8 py-3 rounded-xl font-bold text-white"
                  style={{background:'linear-gradient(135deg, #f093fb, #f5576c)'}}>
                  Ir a mi panel →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}