'use client';
import React, { useEffect, useState } from 'react';
import axiosClient from '@/lib/axiosClient';
import { useRouter } from 'next/navigation';

function NuevoPaquete({ agenciaId, onCreado }: any) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '' });
  const [cargando, setCargando] = useState(false);
  const crear = async () => {
    if (!form.nombre || !form.precio) return;
    setCargando(true);
    try {
      // El cliente axios automáticamente incluye el token en headers
      const res = await axiosClient.post(`/agencias/${agenciaId}/paquetes`, form);
      onCreado(res.data);
      setForm({ nombre: '', descripcion: '', precio: '' });
    } finally { setCargando(false); }
  };
  return (
    <div className="space-y-4">
      {[
        { label:'Nombre del paquete', key:'nombre', placeholder:'Ej: Paquete Diamante', type:'text' },
        { label:'Descripción', key:'descripcion', placeholder:'Ej: 3 cuadros, fotos ilimitadas', type:'text' },
        { label:'Precio (MXN)', key:'precio', placeholder:'Ej: 3500', type:'number' },
      ].map(f => (
        <div key={f.key}>
          <label className="block text-sm mb-2" style={{color:'rgba(255,255,255,0.6)'}}>{f.label}</label>
          <input type={f.type} value={(form as any)[f.key]}
            onChange={e => setForm({...form, [f.key]: e.target.value})}
            placeholder={f.placeholder}
            className="w-full px-4 py-3 rounded-xl outline-none"
            style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}/>
        </div>
      ))}
      <button onClick={crear} disabled={cargando}
        className="w-full py-3 rounded-xl font-bold text-white"
        style={{background:'linear-gradient(135deg, #f093fb, #f5576c)', opacity: cargando ? 0.7 : 1}}>
        {cargando ? 'Guardando...' : '+ Agregar paquete'}
      </button>
    </div>
  );
}

function NuevaFecha({ agenciaId, onCreada }: any) {
  const [form, setForm] = useState({ fecha: '', cupos: '' });
  const [cargando, setCargando] = useState(false);
  const hoy = new Date();
  hoy.setDate(hoy.getDate() + 21);
  const minFecha = hoy.toISOString().split('T')[0];
  const crear = async () => {
    if (!form.fecha || !form.cupos) return;
    setCargando(true);
    try {
      // El cliente axios automáticamente incluye el token en headers
      const res = await axiosClient.post(`/agencias/${agenciaId}/fechas`, form);
      onCreada(res.data);
      setForm({ fecha: '', cupos: '' });
    } finally { setCargando(false); }
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-2" style={{color:'rgba(255,255,255,0.6)'}}>Fecha disponible</label>
        <input type="date" value={form.fecha} min={minFecha}
          onChange={e => setForm({...form, fecha: e.target.value})}
          className="w-full px-4 py-3 rounded-xl outline-none"
          style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}/>
        <p className="text-xs mt-1" style={{color:'rgba(255,255,255,0.3)'}}>Mínimo 3 semanas de anticipación</p>
      </div>
      <div>
        <label className="block text-sm mb-2" style={{color:'rgba(255,255,255,0.6)'}}>Cupos disponibles</label>
        <input type="number" value={form.cupos}
          onChange={e => setForm({...form, cupos: e.target.value})}
          placeholder="Ej: 30"
          className="w-full px-4 py-3 rounded-xl outline-none"
          style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}/>
      </div>
      <button onClick={crear} disabled={cargando}
        className="w-full py-3 rounded-xl font-bold text-white"
        style={{background:'linear-gradient(135deg, #f093fb, #f5576c)', opacity: cargando ? 0.7 : 1}}>
        {cargando ? 'Guardando...' : '+ Agregar fecha'}
      </button>
    </div>
  );
}

function SubirModelo({ agenciaId, onSubido }: any) {
  const [form, setForm] = useState({ nombre: '', tipo: 'MARCO' });
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const seleccionarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setArchivo(file); setPreview(URL.createObjectURL(file)); }
  };
  const subir = async () => {
    if (!archivo || !form.nombre) return;
    setCargando(true);
    try {
      const formData = new FormData();
      formData.append('imagen', archivo);
      formData.append('agenciaId', agenciaId);
      formData.append('nombre', form.nombre);
      formData.append('tipo', form.tipo);
      // El cliente axios automáticamente incluye el token en headers
      const res = await axiosClient.post('/modelos/subir', formData);
      onSubido(res.data);
      setForm({ nombre: '', tipo: 'MARCO' });
      setArchivo(null);
      setPreview(null);
    } finally { setCargando(false); }
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-2" style={{color:'rgba(255,255,255,0.6)'}}>Nombre del modelo</label>
        <input type="text" value={form.nombre}
          onChange={e => setForm({...form, nombre: e.target.value})}
          placeholder="Ej: Marco dorado clásico"
          className="w-full px-4 py-3 rounded-xl outline-none"
          style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}/>
      </div>
      <div>
        <label className="block text-sm mb-2" style={{color:'rgba(255,255,255,0.6)'}}>Tipo</label>
        <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}
          className="w-full px-4 py-3 rounded-xl outline-none"
          style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}>
          <option value="MARCO" style={{background:'#1a1a2e'}}>Marco</option>
          <option value="FONDO" style={{background:'#1a1a2e'}}>Fondo</option>
          <option value="DISENO" style={{background:'#1a1a2e'}}>Diseño</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-2" style={{color:'rgba(255,255,255,0.6)'}}>Imagen</label>
        <input type="file" accept="image/*" onChange={seleccionarArchivo}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}/>
        <p className="text-xs mt-1" style={{color:'rgba(255,255,255,0.3)'}}>JPG, PNG o WebP — máximo 5MB</p>
      </div>
      {preview && (
        <div className="rounded-xl overflow-hidden" style={{border:'1px solid rgba(255,255,255,0.1)'}}>
          <img src={preview} alt="preview" className="w-full object-cover" style={{maxHeight:200}}/>
        </div>
      )}
      <button onClick={subir} disabled={cargando || !archivo || !form.nombre}
        className="w-full py-3 rounded-xl font-bold text-white"
        style={{background:'linear-gradient(135deg, #f093fb, #f5576c)', opacity: (cargando || !archivo || !form.nombre) ? 0.5 : 1}}>
        {cargando ? 'Subiendo...' : '+ Subir modelo'}
      </button>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [agencia, setAgencia] = useState<any>(null);
  const [modelos, setModelos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [tab, setTab] = useState<'pedidos'|'grupos'|'paquetes'|'fechas'|'modelos'|'link'>('pedidos');
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const token = localStorage.getItem('token');
    if (!token || usuario.rol !== 'AGENCIA') { router.push('/auth/login'); return; }
    // El cliente axios automáticamente incluye el token en headers
    axiosClient.get('/agencias/todas')
      .then(res => {
        const miAgencia = res.data.find((a: any) => a.usuarioId === usuario.id);
        if (miAgencia) {
          setAgencia(miAgencia);
          axiosClient.get(`/modelos/agencia/${miAgencia.id}`)
            .then(r => setModelos(r.data));
          return axiosClient.get(`/pedidos/agencia/${miAgencia.id}`);
        } else { setCargando(false); }
      })
      .then(res => { if (res) setPedidos(res.data.pedidos); setCargando(false); })
      .catch(() => setCargando(false));
  }, []);

  const grupos = pedidos.reduce((acc: any, p: any) => {
    const key = `${p.escuela} — ${p.grado}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const colores: Record<string, string> = {
    PENDIENTE: '#f093fb', CONFIRMADO: '#4ade80', EN_PRODUCCION: '#60a5fa',
    LISTO: '#34d399', ENTREGADO: '#94a3b8',
  };
  const ESTADOS = ['PENDIENTE','CONFIRMADO','EN_PRODUCCION','LISTO','ENTREGADO'];

  const cambiarEstado = async (pedidoId: string, estado: string) => {
    try {
      // El cliente axios automáticamente incluye el token en headers
      await axiosClient.put(`/pedidos/${pedidoId}/estado`, { estado });
      setPedidos(prev => prev.map(p => p.id === pedidoId ? {...p, estado} : p));
    } catch (err) { console.error(err); }
  };

  const copiarLink = () => {
    if (!agencia) return;
    navigator.clipboard.writeText(`${window.location.origin}/agencia/${agencia.slug}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <main className="min-h-screen" style={{background:'#0f0c29'}}>
      <header style={{background:'rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div style={{width:36, height:36, background:'linear-gradient(135deg, #f093fb, #f5576c)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <span className="text-white font-bold">G</span>
            </div>
            <div>
              <p className="text-white font-bold">{agencia?.nombre || 'Panel de Agencia'}</p>
              <p className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>Panel de administración</p>
            </div>
          </div>
          <button onClick={() => { localStorage.clear(); router.push('/'); }}
            className="px-4 py-2 rounded-xl text-sm"
            style={{background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)'}}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label:'Total pedidos', value: pedidos.length },
            { label:'Pendientes', value: pedidos.filter(p => p.estado === 'PENDIENTE').length },
            { label:'Confirmados', value: pedidos.filter(p => p.estado === 'CONFIRMADO').length },
            { label:'Grupos', value: Object.keys(grupos).length },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl p-5 text-center" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm mt-1" style={{color:'rgba(255,255,255,0.4)'}}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {([
            { key:'pedidos',  label:'📋 Pedidos' },
            { key:'grupos',   label:'👥 Grupos' },
            { key:'paquetes', label:'📦 Paquetes' },
            { key:'fechas',   label:'📅 Fechas' },
            { key:'modelos',  label:'🖼️ Modelos' },
            { key:'link',     label:'🔗 Mi link' },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: tab === t.key ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'rgba(255,255,255,0.05)',
                color: 'white', border: tab === t.key ? 'none' : '1px solid rgba(255,255,255,0.1)'
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'pedidos' && (
          <div className="space-y-3">
            {cargando ? (
              <p className="text-center py-10" style={{color:'rgba(255,255,255,0.4)'}}>Cargando...</p>
            ) : pedidos.length === 0 ? (
              <div className="text-center py-16" style={{color:'rgba(255,255,255,0.3)'}}>
                <p className="text-5xl mb-4">📭</p><p className="text-lg">Aún no hay pedidos</p>
              </div>
            ) : pedidos.map(p => (
              <div key={p.id} className="rounded-2xl p-5" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white font-medium">{p.usuario?.nombre}</p>
                    <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.4)'}}>{p.escuela} — {p.grado}</p>
                    <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.3)'}}>Leyenda: {p.leyenda}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold mb-2" style={{color:'#f093fb'}}>${p.totalPago?.toLocaleString('es-MX')} MXN</p>
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{background: colores[p.estado]+'33', color: colores[p.estado]}}>
                      {p.estado}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-3 pt-3" style={{borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                  <p className="text-xs w-full mb-1" style={{color:'rgba(255,255,255,0.3)'}}>Cambiar estado:</p>
                  {ESTADOS.map(estado => (
                    <button key={estado} onClick={() => cambiarEstado(p.id, estado)}
                      className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: p.estado === estado ? colores[estado]+'33' : 'rgba(255,255,255,0.05)',
                        color: p.estado === estado ? colores[estado] : 'rgba(255,255,255,0.4)',
                        border: `1px solid ${p.estado === estado ? colores[estado]+'66' : 'rgba(255,255,255,0.1)'}`,
                      }}>
                      {estado.replace('_',' ')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'grupos' && (
          <div className="space-y-4">
            {Object.keys(grupos).length === 0 ? (
              <div className="text-center py-16" style={{color:'rgba(255,255,255,0.3)'}}>
                <p className="text-5xl mb-4">👥</p><p className="text-lg">No hay grupos aún</p>
              </div>
            ) : Object.entries(grupos).map(([grupo, alumnos]: any) => (
              <div key={grupo} className="rounded-2xl p-5" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold">{grupo}</h3>
                  <span className="px-3 py-1 rounded-full text-xs" style={{background:'rgba(240,147,251,0.2)', color:'#f093fb'}}>
                    {alumnos.length} alumnos
                  </span>
                </div>
                <div className="space-y-2">
                  {alumnos.map((a: any) => (
                    <div key={a.id} className="flex justify-between text-sm py-2" style={{borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                      <span style={{color:'rgba(255,255,255,0.7)'}}>{a.usuario?.nombre}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{background: colores[a.estado]+'22', color: colores[a.estado]}}>{a.estado}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'paquetes' && (
          <div className="max-w-2xl space-y-6">
            <div className="rounded-2xl p-6" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
              <h3 className="text-white font-bold text-lg mb-5">Agregar nuevo paquete</h3>
              <NuevoPaquete agenciaId={agencia?.id} onCreado={(p: any) => setAgencia((prev: any) => ({...prev, paquetes: [...(prev?.paquetes||[]), p]}))} />
            </div>
            <div className="space-y-3">
              <h3 className="text-white font-bold">Paquetes actuales</h3>
              {!agencia?.paquetes?.length ? (
                <p className="text-sm" style={{color:'rgba(255,255,255,0.3)'}}>No hay paquetes aún</p>
              ) : agencia.paquetes.map((p: any) => (
                <div key={p.id} className="rounded-2xl p-4 flex justify-between items-center" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
                  <div>
                    <p className="text-white font-medium">{p.nombre}</p>
                    <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.4)'}}>{p.descripcion}</p>
                    <p className="text-sm font-bold mt-1" style={{color:'#f093fb'}}>${p.precio?.toLocaleString('es-MX')} MXN</p>
                  </div>
                  <button onClick={async () => {
                    const token = localStorage.getItem('token');
                    await axios.delete(`https://darksiders.shop/api/agencias/paquetes/${p.id}`, { headers: { Authorization: `Bearer ${token}` } });
                    setAgencia((prev: any) => ({...prev, paquetes: prev.paquetes.filter((pk: any) => pk.id !== p.id)}));
                  }}
                    className="px-3 py-1 rounded-lg text-xs"
                    style={{background:'rgba(245,87,108,0.2)', color:'#f5576c', border:'1px solid rgba(245,87,108,0.3)'}}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'fechas' && (
          <div className="max-w-2xl space-y-6">
            <div className="rounded-2xl p-6" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
              <h3 className="text-white font-bold text-lg mb-5">Agregar fecha disponible</h3>
              <NuevaFecha agenciaId={agencia?.id} onCreada={(f: any) => setAgencia((prev: any) => ({...prev, fechas: [...(prev?.fechas||[]), f]}))} />
            </div>
            <div className="space-y-3">
              <h3 className="text-white font-bold">Fechas disponibles</h3>
              {!agencia?.fechas?.length ? (
                <p className="text-sm" style={{color:'rgba(255,255,255,0.3)'}}>No hay fechas aún</p>
              ) : agencia.fechas.map((f: any) => (
                <div key={f.id} className="rounded-2xl p-4 flex justify-between items-center" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
                  <div>
                    <p className="text-white font-medium">{new Date(f.fecha).toLocaleDateString('es-MX', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</p>
                    <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.4)'}}>{f.cupos} cupos disponibles</p>
                  </div>
                  <button onClick={async () => {
                    const token = localStorage.getItem('token');
                    await axios.delete(`https://darksiders.shop/api/agencias/fechas/${f.id}`, { headers: { Authorization: `Bearer ${token}` } });
                    setAgencia((prev: any) => ({...prev, fechas: prev.fechas.filter((fe: any) => fe.id !== f.id)}));
                  }}
                    className="px-3 py-1 rounded-lg text-xs"
                    style={{background:'rgba(245,87,108,0.2)', color:'#f5576c', border:'1px solid rgba(245,87,108,0.3)'}}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'modelos' && (
          <div className="space-y-6">
            <div className="max-w-2xl rounded-2xl p-6" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
              <h3 className="text-white font-bold text-lg mb-5">Subir modelo de cuadro</h3>
              <SubirModelo agenciaId={agencia?.id} onSubido={(m: any) => setModelos(prev => [...prev, m])} />
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Modelos subidos</h3>
              {modelos.length === 0 ? (
                <p className="text-sm" style={{color:'rgba(255,255,255,0.3)'}}>No hay modelos aún</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {modelos.map((m: any) => (
                    <div key={m.id} className="rounded-2xl overflow-hidden" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
                      <img src={`https://darksiders.shop${m.imagen}`} alt={m.nombre} className="w-full object-cover" style={{height:140}}/>
                      <div className="p-3">
                        <p className="text-white text-sm font-medium">{m.nombre}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{background:'rgba(240,147,251,0.2)', color:'#f093fb'}}>{m.tipo}</span>
                          <button onClick={async () => {
                            const token = localStorage.getItem('token');
                            await axios.delete(`https://darksiders.shop/api/modelos/${m.id}`, { headers: { Authorization: `Bearer ${token}` } });
                            setModelos(prev => prev.filter((mo: any) => mo.id !== m.id));
                          }}
                            className="text-xs px-2 py-0.5 rounded-lg"
                            style={{background:'rgba(245,87,108,0.2)', color:'#f5576c'}}>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'link' && (
          <div className="max-w-xl">
            <div className="rounded-2xl p-8" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
              <h3 className="text-xl font-bold text-white mb-2">Tu link único</h3>
              <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.4)'}}>Comparte este link con tus clientes para que accedan directamente al perfil de tu agencia</p>
              <div className="flex gap-3 mb-6">
                <div className="flex-1 px-4 py-3 rounded-xl text-sm font-mono" style={{background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.1)', color:'#f093fb', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                  {agencia ? `${window.location.origin}/agencia/${agencia.slug}` : 'Cargando...'}
                </div>
                <button onClick={copiarLink}
                  className="px-5 py-3 rounded-xl text-sm font-bold text-white"
                  style={{background: copiado ? 'linear-gradient(135deg, #4ade80, #22c55e)' : 'linear-gradient(135deg, #f093fb, #f5576c)'}}>
                  {copiado ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { icon:'📱', title:'Comparte en WhatsApp', desc:'Envía tu link a tus clientes por WhatsApp para que vean tus paquetes' },
                  { icon:'📸', title:'Agrega a tu Instagram', desc:'Pon el link en tu bio de Instagram para que te encuentren fácil' },
                  { icon:'🌐', title:'Comparte en redes', desc:'Difunde tu perfil en todas tus redes sociales' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl" style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)'}}>
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{item.title}</p>
                      <p className="text-xs mt-1" style={{color:'rgba(255,255,255,0.4)'}}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}