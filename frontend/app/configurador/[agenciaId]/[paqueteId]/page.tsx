'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

const PASOS = ['Escuela', 'Leyenda', 'Fecha', 'Resumen'];

export default function Configurador() {
  const { agenciaId, paqueteId } = useParams();
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [agencia, setAgencia] = useState<any>(null);
  const [paquete, setPaquete] = useState<any>(null);
  const [form, setForm] = useState({
    escuela: '',
    grado: '',
    nivelEstudio: '',
    leyenda: '',
    fechaId: '',
  });
  
  useEffect(() => {
  if (!agenciaId) return;
  const idAgencia = Array.isArray(agenciaId) ? agenciaId[0] : String(agenciaId);
  const idPaquete = Array.isArray(paqueteId) ? paqueteId[0] : String(paqueteId);
  
  axios.get(`https://darksiders.shop/api/agencias/id/${idAgencia}`)
    .then(res => {
      setAgencia(res.data);
      const p = res.data.paquetes.find((pak: any) => pak.id === idPaquete);
      if (p) {
        setPaquete(p);
      } else {
        setPaquete(res.data.paquetes[0]);
      }
    })
    .catch(err => console.error(err));
    }, [agenciaId, paqueteId]);

  const siguiente = () => setPaso(p => Math.min(p + 1, PASOS.length - 1));
  const anterior = () => setPaso(p => Math.max(p - 1, 0));

  const enviarPedido = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/login'); return; }
      await axios.post('https://darksiders.shop/api/pedidos', {
        agenciaId,
        paqueteId,
        escuela: form.escuela,
        grado: `${form.nivelEstudio} ${form.grado}`,
        leyenda: form.leyenda,
        totalPago: paquete?.precio || 0,
      }, { headers: { Authorization: `Bearer ${token}` } });
      router.push('/pedido-exitoso');
    } catch (err) {
      router.push('/auth/login');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4" style={{background:'#0f0c29'}}>
      <div style={{position:'absolute', top:'10%', left:'20%', width:400, height:400, borderRadius:'50%', background:'rgba(240,147,251,0.08)', filter:'blur(80px)'}}/>

      <div className="max-w-2xl mx-auto relative z-10">
        <a href="/" className="flex items-center gap-2 mb-10">
          <div style={{width:32, height:32, background:'linear-gradient(135deg, #f093fb, #f5576c)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="text-white font-bold">GraduTech <span style={{color:'#f093fb'}}>Pro</span></span>
        </a>

        {/* Progreso */}
        <div className="flex items-center justify-between mb-10">
          {PASOS.map((p, i) => (
            <React.Fragment key={p}>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: i <= paso ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'rgba(255,255,255,0.1)',
                    color: 'white'
                  }}>
                  {i < paso ? '✓' : i + 1}
                </div>
                <span className="text-xs" style={{color: i === paso ? '#f093fb' : 'rgba(255,255,255,0.4)'}}>{p}</span>
              </div>
              {i < PASOS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2" style={{background: i < paso ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'rgba(255,255,255,0.1)'}}/>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Tarjeta paquete */}
        {paquete && (
          <div className="rounded-2xl p-4 mb-6 flex justify-between items-center" style={{background:'rgba(240,147,251,0.1)', border:'1px solid rgba(240,147,251,0.2)'}}>
            <div>
              <p className="text-xs" style={{color:'rgba(255,255,255,0.5)'}}>Paquete seleccionado</p>
              <p className="text-white font-bold">{paquete.nombre}</p>
            </div>
            <div className="text-2xl font-bold" style={{color:'#f093fb'}}>${paquete.precio?.toLocaleString('es-MX')} MXN</div>
          </div>
        )}

        {/* Contenido por paso */}
        <div className="rounded-2xl p-8" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>

          {/* PASO 0: Escuela */}
          {paso === 0 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-white mb-6">¿De qué escuela eres?</h2>
              <div>
                <label className="block text-sm mb-2" style={{color:'rgba(255,255,255,0.6)'}}>Nivel de estudios</label>
                <select
                  value={form.nivelEstudio}
                  onChange={e => setForm({...form, nivelEstudio: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}>
                  <option value="" style={{background:'#1a1a2e'}}>Selecciona tu nivel</option>
                  <option value="Secundaria" style={{background:'#1a1a2e'}}>Secundaria</option>
                  <option value="Preparatoria" style={{background:'#1a1a2e'}}>Preparatoria / Bachillerato</option>
                  <option value="Universidad" style={{background:'#1a1a2e'}}>Universidad / Licenciatura</option>
                  <option value="Posgrado" style={{background:'#1a1a2e'}}>Posgrado / Maestría</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{color:'rgba(255,255,255,0.6)'}}>Nombre de la escuela</label>
                <input
                  type="text"
                  value={form.escuela}
                  onChange={e => setForm({...form, escuela: e.target.value})}
                  placeholder="Ej: Universidad Autónoma de Chiapas"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{color:'rgba(255,255,255,0.6)'}}>Grado / Grupo</label>
                <input
                  type="text"
                  value={form.grado}
                  onChange={e => setForm({...form, grado: e.target.value})}
                  placeholder="Ej: 6to semestre, Grupo A"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}
                />
              </div>
            </div>
          )}

          {/* PASO 1: Leyenda */}
          {paso === 1 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-white mb-2">Tu leyenda del cuadro</h2>
              <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.4)'}}>
                Esta leyenda aparecerá en tu cuadro de graduación. Todos los alumnos de tu grupo deben usar la misma leyenda para ser agrupados correctamente.
              </p>
              <div>
                <label className="block text-sm mb-2" style={{color:'rgba(255,255,255,0.6)'}}>Leyenda del grupo</label>
                <textarea
                  value={form.leyenda}
                  onChange={e => setForm({...form, leyenda: e.target.value})}
                  placeholder="Ej: Generación 2024 — UNACH Ingeniería en Sistemas"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                  style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}
                />
              </div>
              <div className="p-4 rounded-xl" style={{background:'rgba(240,147,251,0.1)', border:'1px solid rgba(240,147,251,0.2)'}}>
                <p className="text-sm" style={{color:'#f093fb'}}>
                  💡 Comparte esta leyenda con tus compañeros para que el sistema los agrupe automáticamente
                </p>
              </div>
            </div>
          )}

          {/* PASO 2: Fecha */}
          {paso === 2 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-white mb-2">Agenda tu sesión</h2>
              <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.4)'}}>
                Selecciona una fecha disponible para la toma de fotos. Las fechas tienen un mínimo de 3 semanas de anticipación.
              </p>
              {agencia?.fechas?.length === 0 ? (
                <div className="text-center py-8" style={{color:'rgba(255,255,255,0.3)'}}>
                  <p className="text-4xl mb-3">📅</p>
                  <p>La agencia aún no ha publicado fechas disponibles</p>
                  <p className="text-sm mt-2">Puedes continuar y la agencia te contactará para coordinar</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {agencia?.fechas?.map((f: any) => (
                    <div
                      key={f.id}
                      onClick={() => setForm({...form, fechaId: f.id})}
                      className="p-4 rounded-xl cursor-pointer transition-all"
                      style={{
                        background: form.fechaId === f.id ? 'linear-gradient(135deg, rgba(240,147,251,0.2), rgba(245,87,108,0.2))' : 'rgba(255,255,255,0.05)',
                        border: form.fechaId === f.id ? '2px solid #f093fb' : '1px solid rgba(255,255,255,0.1)'
                      }}>
                      <p className="text-white font-medium">{new Date(f.fecha).toLocaleDateString('es-MX', {weekday:'long', day:'numeric', month:'long'})}</p>
                      <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.4)'}}>{f.cupos} cupos disponibles</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PASO 3: Resumen */}
          {paso === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">Resumen de tu pedido</h2>
              {[
                {label:'Paquete', value: paquete?.nombre},
                {label:'Escuela', value: form.escuela},
                {label:'Nivel', value: form.nivelEstudio},
                {label:'Grado / Grupo', value: form.grado},
                {label:'Leyenda', value: form.leyenda},
                {label:'Total', value: `$${paquete?.precio?.toLocaleString('es-MX')} MXN`},
              ].map((item, i) => (
                <div key={i} className="flex justify-between py-3" style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                  <span className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>{item.label}</span>
                  <span className="text-sm font-medium text-white">{item.value || '—'}</span>
                </div>
              ))}
              <div className="mt-4 p-4 rounded-xl" style={{background:'rgba(240,147,251,0.1)', border:'1px solid rgba(240,147,251,0.2)'}}>
                <p className="text-sm" style={{color:'#f093fb'}}>
                  💳 Al confirmar se te solicitará el pago de un anticipo para reservar tu lugar
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botones navegación */}
        <div className="flex justify-between mt-6">
          <button
            onClick={anterior}
            disabled={paso === 0}
            className="px-6 py-3 rounded-xl font-medium transition-all"
            style={{background:'rgba(255,255,255,0.08)', color: paso === 0 ? 'rgba(255,255,255,0.2)' : 'white', border:'1px solid rgba(255,255,255,0.1)'}}>
            ← Anterior
          </button>
          {paso < PASOS.length - 1 ? (
            <button
              onClick={siguiente}
              disabled={paso === 0 && (!form.escuela || !form.nivelEstudio)}
              className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
              style={{background:'linear-gradient(135deg, #f093fb, #f5576c)', opacity: paso === 0 && (!form.escuela || !form.nivelEstudio) ? 0.5 : 1}}>
              Siguiente →
            </button>
          ) : (
            <button
              onClick={enviarPedido}
              disabled={cargando}
              className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
              style={{background:'linear-gradient(135deg, #f093fb, #f5576c)', opacity: cargando ? 0.7 : 1}}>
              {cargando ? 'Enviando...' : 'Confirmar pedido ✓'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}