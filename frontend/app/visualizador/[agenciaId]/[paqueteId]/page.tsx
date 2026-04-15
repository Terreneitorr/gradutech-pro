'use client';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

export default function Visualizador() {
  const { agenciaId, paqueteId } = useParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelos, setModelos] = useState<any[]>([]);
  const [paquete, setPaquete] = useState<any>(null);
  const [seleccion, setSeleccion] = useState({
    marco: null as any,
    fondo: null as any,
    diseno: null as any,
  });
  const [texto, setTexto] = useState({
    nombre: '',
    leyenda: '',
  });
  const [tab, setTab] = useState<'MARCO'|'FONDO'|'DISENO'>('MARCO');

  useEffect(() => {
    const idAgencia = Array.isArray(agenciaId) ? agenciaId[0] : String(agenciaId);
    const idPaquete = Array.isArray(paqueteId) ? paqueteId[0] : String(paqueteId);
    axios.get(`https://darksiders.shop/api/agencias/id/${idAgencia}`)
      .then(res => {
        const p = res.data.paquetes.find((pk: any) => pk.id === idPaquete);
        setPaquete(p || res.data.paquetes[0]);
      });
    axios.get(`https://darksiders.shop/api/modelos/agencia/${idAgencia}`)
      .then(res => setModelos(res.data));
  }, [agenciaId, paqueteId]);

  useEffect(() => {
    dibujarCuadro();
  }, [seleccion, texto]);

  const dibujarCuadro = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dibujar = async () => {
      // Fondo
      if (seleccion.fondo) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = `https://darksiders.shop${seleccion.fondo.imagen}`;
        await new Promise(r => { img.onload = r; img.onerror = r; });
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Diseño
      if (seleccion.diseno) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = `https://darksiders.shop${seleccion.diseno.imagen}`;
        await new Promise(r => { img.onload = r; img.onerror = r; });
        ctx.drawImage(img, 20, 20, canvas.width - 40, canvas.height - 40);
      }

      // Área de foto (placeholder)
      const fotoX = canvas.width / 2 - 80;
      const fotoY = 40;
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(fotoX, fotoY, 160, 180);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Tu foto aquí', canvas.width / 2, fotoY + 95);

      // Nombre
      if (texto.nombre) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px serif';
        ctx.textAlign = 'center';
        ctx.fillText(texto.nombre, canvas.width / 2, 260);
      }

      // Leyenda
      if (texto.leyenda) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '12px serif';
        ctx.textAlign = 'center';
        ctx.fillText(texto.leyenda, canvas.width / 2, 285);
      }

      // Marco (encima de todo)
      if (seleccion.marco) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = `https://darksiders.shop${seleccion.marco.imagen}`;
        await new Promise(r => { img.onload = r; img.onerror = r; });
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.strokeStyle = 'rgba(240,147,251,0.6)';
        ctx.lineWidth = 8;
        ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
      }
    };

    dibujar();
  };

  const modelosPorTipo = (tipo: string) => modelos.filter(m => m.tipo === tipo);

  const continuar = () => {
    const idAgencia = Array.isArray(agenciaId) ? agenciaId[0] : String(agenciaId);
    const idPaquete = Array.isArray(paqueteId) ? paqueteId[0] : String(paqueteId);
    router.push(`/configurador/${idAgencia}/${idPaquete}?nombre=${encodeURIComponent(texto.nombre)}&leyenda=${encodeURIComponent(texto.leyenda)}&marco=${seleccion.marco?.id || ''}&fondo=${seleccion.fondo?.id || ''}&diseno=${seleccion.diseno?.id || ''}`);
  };

  return (
    <main className="min-h-screen py-10 px-4" style={{background:'#0f0c29'}}>
      <div style={{position:'absolute', top:'5%', left:'20%', width:400, height:400, borderRadius:'50%', background:'rgba(240,147,251,0.07)', filter:'blur(80px)'}}/>

      <div className="max-w-6xl mx-auto relative z-10">
        <a href="/" className="flex items-center gap-2 mb-8">
          <div style={{width:32, height:32, background:'linear-gradient(135deg, #f093fb, #f5576c)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="text-white font-bold">GraduTech <span style={{color:'#f093fb'}}>Pro</span></span>
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Panel izquierdo: Preview */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Arma tu cuadro</h2>
            <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.4)'}}>
              Selecciona los elementos y ve cómo queda tu cuadro en tiempo real
            </p>

            {paquete && (
              <div className="rounded-xl px-4 py-3 mb-6 flex justify-between" style={{background:'rgba(240,147,251,0.1)', border:'1px solid rgba(240,147,251,0.2)'}}>
                <span className="text-white font-medium text-sm">{paquete.nombre}</span>
                <span className="font-bold text-sm" style={{color:'#f093fb'}}>${paquete.precio?.toLocaleString('es-MX')} MXN</span>
              </div>
            )}

            {/* Canvas preview */}
            <div className="rounded-2xl overflow-hidden mb-6 flex justify-center" style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', padding:16}}>
              <canvas ref={canvasRef} width={320} height={320} style={{borderRadius:8, maxWidth:'100%'}}/>
            </div>

            {/* Inputs de texto */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-2" style={{color:'rgba(255,255,255,0.6)'}}>Tu nombre completo</label>
                <input type="text" value={texto.nombre}
                  onChange={e => setTexto({...texto, nombre: e.target.value})}
                  placeholder="Ej: Leonardo Martínez"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}/>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{color:'rgba(255,255,255,0.6)'}}>Leyenda del cuadro</label>
                <input type="text" value={texto.leyenda}
                  onChange={e => setTexto({...texto, leyenda: e.target.value})}
                  placeholder="Ej: Generación 2024 — UNACH"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}/>
              </div>
            </div>
          </div>

          {/* Panel derecho: Selector de elementos */}
          <div>
            <div className="flex gap-2 mb-6">
              {(['MARCO','FONDO','DISENO'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all flex-1"
                  style={{
                    background: tab === t ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'rgba(255,255,255,0.05)',
                    color: 'white', border: tab === t ? 'none' : '1px solid rgba(255,255,255,0.1)'
                  }}>
                  {t === 'MARCO' ? '🖼️ Marco' : t === 'FONDO' ? '🎨 Fondo' : '✨ Diseño'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Opción ninguno */}
              <div
                onClick={() => setSeleccion({...seleccion, [tab.toLowerCase()]: null})}
                className="rounded-xl p-3 cursor-pointer transition-all flex items-center justify-center"
                style={{
                  background: seleccion[tab.toLowerCase() as keyof typeof seleccion] === null ? 'rgba(240,147,251,0.2)' : 'rgba(255,255,255,0.05)',
                  border: seleccion[tab.toLowerCase() as keyof typeof seleccion] === null ? '2px solid #f093fb' : '1px solid rgba(255,255,255,0.1)',
                  height: 100
                }}>
                <div className="text-center">
                  <p className="text-2xl">✕</p>
                  <p className="text-xs mt-1" style={{color:'rgba(255,255,255,0.5)'}}>Sin {tab.toLowerCase()}</p>
                </div>
              </div>

              {modelosPorTipo(tab).length === 0 ? (
                <div className="rounded-xl p-3 flex items-center justify-center" style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', height:100}}>
                  <p className="text-xs text-center" style={{color:'rgba(255,255,255,0.3)'}}>La agencia no ha subido {tab.toLowerCase()}s aún</p>
                </div>
              ) : modelosPorTipo(tab).map((m: any) => {
                const clave = tab.toLowerCase() as keyof typeof seleccion;
                const seleccionado = seleccion[clave]?.id === m.id;
                return (
                  <div key={m.id}
                    onClick={() => setSeleccion({...seleccion, [clave]: m})}
                    className="rounded-xl overflow-hidden cursor-pointer transition-all"
                    style={{
                      border: seleccionado ? '2px solid #f093fb' : '1px solid rgba(255,255,255,0.1)',
                      transform: seleccionado ? 'scale(1.03)' : 'scale(1)'
                    }}>
                    <img src={`https://darksiders.shop${m.imagen}`} alt={m.nombre} className="w-full object-cover" style={{height:70}}/>
                    <div className="px-2 py-1" style={{background:'rgba(0,0,0,0.5)'}}>
                      <p className="text-white text-xs font-medium truncate">{m.nombre}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumen selección */}
            <div className="rounded-xl p-4 mb-6" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
              <p className="text-white text-sm font-bold mb-3">Tu selección actual</p>
              {[
                { label:'Marco', val: seleccion.marco },
                { label:'Fondo', val: seleccion.fondo },
                { label:'Diseño', val: seleccion.diseno },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-2" style={{borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none'}}>
                  <span style={{color:'rgba(255,255,255,0.4)'}}>{item.label}</span>
                  <span style={{color: item.val ? '#f093fb' : 'rgba(255,255,255,0.2)'}}>
                    {item.val ? item.val.nombre : 'Sin seleccionar'}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={continuar}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105"
              style={{background:'linear-gradient(135deg, #f093fb, #f5576c)'}}>
              Continuar con este diseño →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}