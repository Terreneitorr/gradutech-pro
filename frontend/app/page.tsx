'use client';
import { useEffect, useState } from 'react';
import axiosClient from '@/lib/axiosClient';

interface Agencia {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  logo: string;
}

export default function Home() {
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    // El cliente axios está configurado con baseURL y automáticamente incluye el token
    axiosClient.get('/agencias')
      .then(res => setAgencias(res.data))
      .catch(err => console.error(err));
  }, []);

  const [usuario, setUsuario] = useState<any>(null);

useEffect(() => {
  const u = localStorage.getItem('usuario');
  if (u) setUsuario(JSON.parse(u));
}, []);

  const filtradas = agencias.filter(a =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="min-h-screen" style={{background: '#0f0c29'}}>

      {/* HEADER */}
      <header className="bg-white shadow-sm" style={{background:'rgba(255,255,255,0.05)', backdropFilter:'blur(10px)', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div style={{width:36, height:36, background:'linear-gradient(135deg, #f093fb, #f5576c)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-white font-bold text-xl">GraduTech <span style={{color:'#f093fb'}}>Pro</span></span>
          </div>
          <nav className="flex items-center gap-3">
            {usuario ? (
              <>
                <a href="/mis-pedidos" className="px-5 py-2 text-white rounded-full text-sm font-medium hover:bg-white hover:bg-opacity-10 transition-all">
                  Mis pedidos
                </a>
                <span className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>
                  {usuario.nombre}
                </span>
                <button
                  onClick={() => { localStorage.clear(); setUsuario(null); }}
                  className="px-5 py-2 rounded-full text-sm font-medium border transition-all"
                  style={{borderColor:'rgba(255,255,255,0.3)', color:'white'}}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <a href="/auth/login" className="px-5 py-2 text-white rounded-full text-sm font-medium hover:bg-white hover:bg-opacity-10 transition-all">
                  Iniciar sesión
                </a>
                <a href="/auth/registro" className="px-5 py-2 rounded-full text-sm font-bold transition-all" style={{background:'linear-gradient(135deg, #f093fb, #f5576c)', color:'white'}}>
                  Registrarse
                </a>
                <a href="/agencia/registro" className="px-5 py-2 rounded-full text-sm font-medium border transition-all" style={{borderColor:'rgba(255,255,255,0.3)', color:'white'}}>
                  Soy agencia
                </a>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div style={{position:'absolute', top:-100, left:'20%', width:400, height:400, borderRadius:'50%', background:'rgba(240,147,251,0.15)', filter:'blur(60px)'}}/>
        <div style={{position:'absolute', top:50, right:'15%', width:300, height:300, borderRadius:'50%', background:'rgba(245,87,108,0.15)', filter:'blur(60px)'}}/>
        <div className="relative z-10">
          <span className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-6" style={{background:'rgba(240,147,251,0.2)', color:'#f093fb', border:'1px solid rgba(240,147,251,0.3)'}}>
            ✨ La plataforma #1 de graduaciones en México
          </span>
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Tu graduación,<br/>
            <span style={{background:'linear-gradient(135deg, #f093fb, #f5576c)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
              perfecta desde el primer clic
            </span>
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{color:'rgba(255,255,255,0.6)'}}>
            Encuentra la agencia fotográfica ideal, arma tu paquete a tu medida y agenda tu sesión sin complicaciones
          </p>
          <div className="flex justify-center">
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl w-full max-w-lg" style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)'}}>
              <svg className="w-5 h-5" fill="none" stroke="rgba(255,255,255,0.4)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Buscar agencia fotográfica..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="bg-transparent flex-1 text-white outline-none placeholder-gray-500"
              />
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-12">
            {[{n:'500+', l:'Graduados felices'},{n:'50+', l:'Agencias verificadas'},{n:'0%', l:'Errores en pedidos'}].map((s,i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-white">{s.n}</div>
                <div className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENCIAS */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-white">Agencias disponibles</h3>
          <span style={{color:'rgba(255,255,255,0.4)', fontSize:14}}>{filtradas.length} agencias</span>
        </div>
        {filtradas.length === 0 ? (
          <div className="text-center py-20">
            <div style={{fontSize:48}}>📷</div>
            <p className="text-xl mt-4" style={{color:'rgba(255,255,255,0.4)'}}>Próximamente agencias disponibles</p>
            <p className="mt-2 text-sm" style={{color:'rgba(255,255,255,0.25)'}}>¿Tienes una agencia? <a href="/agencia/registro" style={{color:'#f093fb'}}>Regístrala aquí</a></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtradas.map(agencia => (
              <a key={agencia.id} href={`/agencia/${agencia.slug}`}
                className="block rounded-2xl p-6 transition-all hover:scale-105"
                style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl font-bold text-white"
                  style={{background:'linear-gradient(135deg, #f093fb, #f5576c)'}}>
                  {agencia.nombre.charAt(0)}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{agencia.nombre}</h4>
                <p className="text-sm mb-4" style={{color:'rgba(255,255,255,0.5)'}}>
                  {agencia.descripcion || 'Agencia de fotografía de graduación'}
                </p>
                <span className="text-sm font-medium" style={{color:'#f093fb'}}>Ver paquetes →</span>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8 text-center" style={{borderColor:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.3)', fontSize:14}}>
        GraduTech Pro © 2024 — La plataforma digital para agencias de graduación
      </footer>
    </main>
  );
}