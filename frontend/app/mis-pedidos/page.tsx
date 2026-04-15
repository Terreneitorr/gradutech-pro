'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function MisPedidos() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const u = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!token) { router.push('/auth/login'); return; }
    setUsuario(u);
    axios.get('https://darksiders.shop/api/pedidos/mis-pedidos',
      { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setPedidos(res.data); setCargando(false); })
      .catch(() => { router.push('/auth/login'); });
  }, []);

  const colores: Record<string, { bg: string; text: string; label: string }> = {
    PENDIENTE:     { bg: 'rgba(240,147,251,0.15)', text: '#f093fb', label: 'Pendiente' },
    CONFIRMADO:    { bg: 'rgba(74,222,128,0.15)',  text: '#4ade80', label: 'Confirmado' },
    EN_PRODUCCION: { bg: 'rgba(96,165,250,0.15)',  text: '#60a5fa', label: 'En producción' },
    LISTO:         { bg: 'rgba(52,211,153,0.15)',  text: '#34d399', label: 'Listo' },
    ENTREGADO:     { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8', label: 'Entregado' },
  };

  const pasos = ['PENDIENTE', 'CONFIRMADO', 'EN_PRODUCCION', 'LISTO', 'ENTREGADO'];

  return (
    <main className="min-h-screen" style={{background:'#0f0c29'}}>
      <div style={{position:'absolute', top:'5%', right:'20%', width:350, height:350, borderRadius:'50%', background:'rgba(240,147,251,0.07)', filter:'blur(80px)'}}/>

      <header style={{background:'rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <div style={{width:36, height:36, background:'linear-gradient(135deg, #f093fb, #f5576c)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-white font-bold text-xl">GraduTech <span style={{color:'#f093fb'}}>Pro</span></span>
          </a>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>
              {usuario?.nombre}
            </span>
            <button
              onClick={() => { localStorage.clear(); router.push('/'); }}
              className="px-4 py-2 rounded-xl text-sm"
              style={{background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)'}}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Mis pedidos</h1>
          <p className="mt-2 text-sm" style={{color:'rgba(255,255,255,0.4)'}}>
            Aquí puedes ver el estado de todos tus pedidos de graduación
          </p>
        </div>

        {cargando ? (
          <div className="text-center py-20" style={{color:'rgba(255,255,255,0.4)'}}>
            <p>Cargando pedidos...</p>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-xl text-white mb-2">No tienes pedidos aún</p>
            <p className="text-sm mb-8" style={{color:'rgba(255,255,255,0.4)'}}>
              Explora las agencias y arma tu paquete de graduación
            </p>
            <a href="/"
              className="px-8 py-3 rounded-xl font-bold text-white inline-block"
              style={{background:'linear-gradient(135deg, #f093fb, #f5576c)'}}>
              Ver agencias
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.map(pedido => (
              <div key={pedido.id} className="rounded-2xl overflow-hidden"
                style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>

                {/* Header del pedido */}
                <div className="px-6 py-4 flex justify-between items-start" style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                  <div>
                    <p className="text-white font-bold text-lg">{pedido.agencia?.nombre}</p>
                    <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.4)'}}>
                      {new Date(pedido.createdAt).toLocaleDateString('es-MX', {day:'numeric', month:'long', year:'numeric'})}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{background: colores[pedido.estado]?.bg, color: colores[pedido.estado]?.text}}>
                    {colores[pedido.estado]?.label}
                  </span>
                </div>

                {/* Progreso */}
                <div className="px-6 py-4" style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                  <p className="text-xs mb-3" style={{color:'rgba(255,255,255,0.4)'}}>Progreso del pedido</p>
                  <div className="flex items-center gap-1">
                    {pasos.map((paso, i) => {
                      const indiceActual = pasos.indexOf(pedido.estado);
                      const completado = i <= indiceActual;
                      return (
                        <React.Fragment key={paso}>
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{
                                background: completado ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'rgba(255,255,255,0.1)',
                                color: 'white'
                              }}>
                              {completado ? '✓' : i + 1}
                            </div>
                          </div>
                          {i < pasos.length - 1 && (
                            <div className="flex-1 h-0.5"
                              style={{background: i < indiceActual ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'rgba(255,255,255,0.1)'}}/>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-1">
                    {['Pendiente','Confirmado','Producción','Listo','Entregado'].map((l, i) => (
                      <span key={i} className="text-xs" style={{color:'rgba(255,255,255,0.3)', fontSize:9}}>{l}</span>
                    ))}
                  </div>
                </div>

                {/* Detalles */}
                <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label:'Paquete', value: pedido.paquete?.nombre },
                    { label:'Escuela', value: pedido.escuela },
                    { label:'Grado', value: pedido.grado },
                    { label:'Total', value: `$${pedido.totalPago?.toLocaleString('es-MX')} MXN` },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-xs mb-1" style={{color:'rgba(255,255,255,0.4)'}}>{item.label}</p>
                      <p className="text-sm font-medium text-white">{item.value || '—'}</p>
                    </div>
                  ))}
                </div>

                {/* Leyenda */}
                <div className="px-6 pb-4">
                  <div className="px-4 py-3 rounded-xl" style={{background:'rgba(240,147,251,0.08)', border:'1px solid rgba(240,147,251,0.15)'}}>
                    <p className="text-xs mb-1" style={{color:'rgba(255,255,255,0.4)'}}>Leyenda del cuadro</p>
                    <p className="text-sm" style={{color:'#f093fb'}}>{pedido.leyenda}</p>
                  </div>
                </div>

                {/* Anticipo */}
               {!pedido.anticipoPagado && (
                    <div className="px-6 pb-4">
                      <button
                        onClick={async () => {
                          const token = localStorage.getItem('token');
                          try {
                            const res = await axios.post('https://darksiders.shop/api/pagos/anticipo',
                              { pedidoId: pedido.id },
                              { headers: { Authorization: `Bearer ${token}` } });
                            window.location.href = res.data.url;
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
                        style={{background:'linear-gradient(135deg, #f093fb, #f5576c)'}}>
                        💳 Pagar anticipo (30%) para confirmar lugar
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}