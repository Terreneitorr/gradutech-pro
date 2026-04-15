'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Admin() {
  const router = useRouter();
  const [agencias, setAgencias] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [tab, setTab] = useState<'agencias'|'publicidad'>('agencias');

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const token = localStorage.getItem('token');
    if (!token || usuario.rol !== 'ADMIN') { router.push('/'); return; }
    axios.get('http://localhost:3000/api/agencias/todas',
      { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setAgencias(res.data); setCargando(false); })
      .catch(() => setCargando(false));
  }, []);

  const toggleAgencia = async (id: string, activa: boolean) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:3000/api/agencias/${id}`,
      { activa: !activa },
      { headers: { Authorization: `Bearer ${token}` } });
    setAgencias(prev => prev.map(a => a.id === id ? {...a, activa: !activa} : a));
  };

  const toggleSuscripcion = async (id: string, suscripcion: boolean) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:3000/api/agencias/${id}`,
      { suscripcion: !suscripcion },
      { headers: { Authorization: `Bearer ${token}` } });
    setAgencias(prev => prev.map(a => a.id === id ? {...a, suscripcion: !suscripcion} : a));
  };

  return (
    <main className="min-h-screen" style={{background:'#0f0c29'}}>
      <header style={{background:'rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div style={{width:36, height:36, background:'linear-gradient(135deg, #f093fb, #f5576c)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-white font-bold text-xl">Panel <span style={{color:'#f093fb'}}>Admin</span></span>
          </div>
          <button
            onClick={() => { localStorage.clear(); router.push('/'); }}
            className="px-4 py-2 rounded-xl text-sm"
            style={{background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)'}}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label:'Total agencias', value: agencias.length },
            { label:'Activas', value: agencias.filter(a => a.activa).length },
            { label:'Con suscripción', value: agencias.filter(a => a.suscripcion).length },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl p-5 text-center" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm mt-1" style={{color:'rgba(255,255,255,0.4)'}}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['agencias', 'publicidad'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all"
              style={{
                background: tab === t ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'rgba(255,255,255,0.05)',
                color: 'white',
                border: tab === t ? 'none' : '1px solid rgba(255,255,255,0.1)'
              }}>
              {t === 'agencias' ? '🏢 Agencias' : '📢 Publicidad'}
            </button>
          ))}
        </div>

        {/* Agencias */}
        {tab === 'agencias' && (
          <div className="space-y-3">
            {cargando ? (
              <p className="text-center py-10" style={{color:'rgba(255,255,255,0.4)'}}>Cargando...</p>
            ) : agencias.length === 0 ? (
              <div className="text-center py-16" style={{color:'rgba(255,255,255,0.3)'}}>
                <p className="text-5xl mb-4">🏢</p>
                <p className="text-lg">No hay agencias registradas</p>
              </div>
            ) : agencias.map(a => (
              <div key={a.id} className="rounded-2xl p-5 flex justify-between items-center"
                style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
                <div>
                  <p className="text-white font-bold">{a.nombre}</p>
                  <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.4)'}}>/{a.slug}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => toggleSuscripcion(a.id, a.suscripcion)}
                    className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: a.suscripcion ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)',
                      color: a.suscripcion ? '#4ade80' : 'rgba(255,255,255,0.4)',
                      border: `1px solid ${a.suscripcion ? '#4ade8066' : 'rgba(255,255,255,0.1)'}`
                    }}>
                    {a.suscripcion ? '✓ Suscrito' : 'Sin suscripción'}
                  </button>
                  <button
                    onClick={() => toggleAgencia(a.id, a.activa)}
                    className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: a.activa ? 'rgba(240,147,251,0.2)' : 'rgba(245,87,108,0.2)',
                      color: a.activa ? '#f093fb' : '#f5576c',
                      border: `1px solid ${a.activa ? 'rgba(240,147,251,0.3)' : 'rgba(245,87,108,0.3)'}`
                    }}>
                    {a.activa ? '● Activa' : '○ Pausada'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Publicidad */}
        {tab === 'publicidad' && (
          <div className="text-center py-16" style={{color:'rgba(255,255,255,0.3)'}}>
            <p className="text-5xl mb-4">📢</p>
            <p className="text-lg">Módulo de publicidad próximamente</p>
            <p className="text-sm mt-2">Aquí podrás gestionar los anuncios de sastrerías y comerciales</p>
          </div>
        )}
      </div>
    </main>
  );
}