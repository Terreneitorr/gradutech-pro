'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BienvenidaAgencia() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!u.id) { router.push('/'); return; }
    setUsuario(u);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{background:'#0f0c29'}}>
      <div style={{position:'absolute', top:'20%', left:'25%', width:500, height:400, borderRadius:'50%', background:'rgba(240,147,251,0.08)', filter:'blur(80px)'}}/>
      <div className="relative z-10 text-center max-w-lg">
        <div className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl mx-auto mb-8"
          style={{background:'linear-gradient(135deg, #f093fb, #f5576c)'}}>
          🎉
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">¡Bienvenida a GraduTech Pro!</h1>
        <p className="text-lg mb-8" style={{color:'rgba(255,255,255,0.5)'}}>
          Tu agencia fue registrada correctamente. Un administrador revisará tu solicitud y activará tu perfil en breve.
        </p>

        <div className="rounded-2xl p-6 mb-8 text-left" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
          <p className="text-sm font-bold text-white mb-4">Próximos pasos:</p>
          {[
            { num:'01', title:'Revisión de perfil', desc:'El equipo de GraduTech Pro revisará tu solicitud en 24-48 horas' },
            { num:'02', title:'Activación', desc:'Recibirás un correo cuando tu perfil esté activo en el directorio' },
            { num:'03', title:'Configura tus paquetes', desc:'Agrega tus paquetes, precios y fechas disponibles desde tu panel' },
            { num:'04', title:'Comparte tu link', desc:'Tu link único será generado automáticamente al activarse tu perfil' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 py-3" style={{borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none'}}>
              <span className="text-lg font-bold flex-shrink-0" style={{color:'#f093fb'}}>{item.num}</span>
              <div>
                <p className="text-white font-medium text-sm">{item.title}</p>
                <p className="text-xs mt-1" style={{color:'rgba(255,255,255,0.4)'}}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
            style={{background:'linear-gradient(135deg, #f093fb, #f5576c)'}}>
            Ir a mi panel →
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl font-medium text-white transition-all"
            style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)'}}>
            Ver directorio
          </button>
        </div>
      </div>
    </main>
  );
}