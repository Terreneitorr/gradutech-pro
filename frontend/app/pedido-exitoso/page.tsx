'use client';
import { useRouter } from 'next/navigation';

export default function PedidoExitoso() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{background:'#0f0c29'}}>
      <div style={{position:'absolute', top:'20%', left:'30%', width:400, height:400, borderRadius:'50%', background:'rgba(240,147,251,0.1)', filter:'blur(80px)'}}/>
      <div className="relative z-10 text-center max-w-md">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-8"
          style={{background:'linear-gradient(135deg, rgba(240,147,251,0.2), rgba(245,87,108,0.2))', border:'2px solid #f093fb'}}>
          ✓
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">¡Pedido enviado!</h1>
        <p className="text-lg mb-4" style={{color:'rgba(255,255,255,0.5)'}}>
          Tu pedido fue recibido correctamente. La agencia fotográfica revisará tu solicitud y te contactará pronto.
        </p>
        <div className="rounded-2xl p-6 mb-8 text-left" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
          {[
            '📧 Recibirás un correo con los detalles de tu pedido',
            '📅 La agencia confirmará tu fecha de sesión',
            '💳 Se te enviará el link de pago del anticipo',
            '📦 Tu cuadro estará listo para el día de la sesión',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-3" style={{borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none'}}>
              <span className="text-sm" style={{color:'rgba(255,255,255,0.7)'}}>{item}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl font-medium text-white transition-all"
            style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)'}}>
            Ir al inicio
          </button>
          <button
            onClick={() => router.push('/mis-pedidos')}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
            style={{background:'linear-gradient(135deg, #f093fb, #f5576c)'}}>
            Ver mis pedidos
          </button>
        </div>
      </div>
    </main>
  );
}