'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

interface Paquete {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
}

interface Agencia {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  paquetes: Paquete[];
  fechas: { id: string; fecha: string; cupos: number }[];
}

export default function PerfilAgencia() {
  const { slug } = useParams();
  const [agencia, setAgencia] = useState<Agencia | null>(null);
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<Paquete | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/agencias/${slug}`)
      .then(res => { setAgencia(res.data); setCargando(false); })
      .catch(() => setCargando(false));
  }, [slug]);

  if (cargando) return (
    <main className="min-h-screen flex items-center justify-center" style={{background:'#0f0c29'}}>
      <div className="text-white text-xl">Cargando...</div>
    </main>
  );

  if (!agencia) return (
    <main className="min-h-screen flex items-center justify-center" style={{background:'#0f0c29'}}>
      <div className="text-white text-xl">Agencia no encontrada</div>
    </main>
  );

  return (
    <main className="min-h-screen" style={{background:'#0f0c29'}}>
      <header style={{background:'rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <div style={{width:36, height:36, background:'linear-gradient(135deg, #f093fb, #f5576c)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-white font-bold text-xl">GraduTech <span style={{color:'#f093fb'}}>Pro</span></span>
          </a>
          <a href="/auth/login" className="px-5 py-2 rounded-full text-sm font-bold text-white" style={{background:'linear-gradient(135deg, #f093fb, #f5576c)'}}>
            Iniciar sesión
          </a>
        </div>
      </header>

      <section className="relative py-16 px-6 text-center overflow-hidden">
        <div style={{position:'absolute', top:-50, left:'25%', width:500, height:300, borderRadius:'50%', background:'rgba(240,147,251,0.1)', filter:'blur(60px)'}}/>
        <div className="relative z-10">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-bold text-white mx-auto mb-6" style={{background:'linear-gradient(135deg, #f093fb, #f5576c)'}}>
            {agencia.nombre.charAt(0)}
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{agencia.nombre}</h1>
          <p className="text-lg max-w-xl mx-auto" style={{color:'rgba(255,255,255,0.5)'}}>
            {agencia.descripcion || 'Agencia especializada en fotografía de graduación'}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-white mb-8">Elige tu paquete</h2>
        {agencia.paquetes.length === 0 ? (
          <div className="text-center py-16" style={{color:'rgba(255,255,255,0.3)'}}>
            <p className="text-6xl">📦</p>
            <p className="mt-4 text-lg">Esta agencia aún no tiene paquetes disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencia.paquetes.map(paquete => (
              <div
                key={paquete.id}
                onClick={() => setPaqueteSeleccionado(paquete)}
                className="rounded-2xl p-6 cursor-pointer transition-all hover:scale-105"
                style={{
                  background: paqueteSeleccionado?.id === paquete.id ? 'linear-gradient(135deg, rgba(240,147,251,0.2), rgba(245,87,108,0.2))' : 'rgba(255,255,255,0.05)',
                  border: paqueteSeleccionado?.id === paquete.id ? '2px solid #f093fb' : '1px solid rgba(255,255,255,0.1)'
                }}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{paquete.nombre}</h3>
                  {paqueteSeleccionado?.id === paquete.id && (
                    <span className="px-2 py-1 rounded-full text-xs font-bold" style={{background:'#f093fb', color:'white'}}>Seleccionado</span>
                  )}
                </div>
                <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.5)'}}>
                  {paquete.descripcion || 'Paquete de fotografía profesional'}
                </p>
                <div className="text-3xl font-bold" style={{color:'#f093fb'}}>
                  ${paquete.precio.toLocaleString('es-MX')}
                  <span className="text-sm font-normal ml-1" style={{color:'rgba(255,255,255,0.4)'}}>MXN</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {paqueteSeleccionado && (
          <div className="mt-10 text-center">
            <a href={`/visualizador/${agencia.id}/${paqueteSeleccionado.id}`}
               className="inline-block px-10 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:scale-105"
               style={{background:'linear-gradient(135deg, #f093fb, #f5576c)' as React.CSSProperties['background']}}>
               Continuar con {paqueteSeleccionado.nombre} →
            </a>
          </div>
        )}
      </section>
    </main>
  );
}