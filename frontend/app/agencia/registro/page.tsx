'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const TERMINOS = `TÉRMINOS Y CONDICIONES — GRADUTECH PRO

1. SUSCRIPCIÓN
La agencia fotográfica acepta pagar una suscripción mensual para aparecer en el directorio de GraduTech Pro. El incumplimiento del pago pausará automáticamente su perfil.

2. CONTENIDO
La agencia es responsable de la veracidad de su información, paquetes y precios publicados en la plataforma.

3. PEDIDOS
La agencia se compromete a atender los pedidos recibidos a través de la plataforma en tiempo y forma acordados con el cliente.

4. COMISIONES
GraduTech Pro no cobra comisión por pedido. El modelo es exclusivamente de suscripción mensual.

5. PUBLICIDAD
Los anuncios de terceros (sastrerías, etc.) son gestionados exclusivamente por GraduTech Pro y no interfieren con el perfil de la agencia.

6. CANCELACIÓN
La agencia puede cancelar su suscripción en cualquier momento. Su perfil permanecerá visible hasta el fin del período pagado.

7. DATOS
GraduTech Pro protege los datos de las agencias y usuarios conforme a la legislación mexicana vigente.`;

const PLANES = [
  { nombre:'Plan Básico', precio:'$299', periodo:'mes', desc:'Perfil en el directorio, hasta 3 paquetes, soporte por email' },
  { nombre:'Plan Pro', precio:'$599', periodo:'mes', desc:'Todo lo básico + paquetes ilimitados, estadísticas, soporte prioritario' },
  { nombre:'Plan Anual', precio:'$4,999', periodo:'año', desc:'Todo Pro + 2 meses gratis, agencia destacada en el directorio' },
];

export default function RegistroAgencia() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    email: '',
    password: '',
    confirmar: '',
  });

  const registrar = async () => {
  if (!form.nombre || !form.email || !form.password) {
    setError('Por favor regresa al paso anterior y llena todos los campos');
    setPaso(1);
    return;
  }
  if (form.password !== form.confirmar) {
    setError('Las contraseñas no coinciden');
    setPaso(1);
    return;
  }
  setCargando(true);
  setError('');
  try {
    const res = await axios.post('https://darksiders.shop/api/auth/registro', {
      nombre: form.nombre,
      email: form.email,
      password: form.password,
      rol: 'AGENCIA'
    });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
    await axios.post('https://darksiders.shop/api/agencias', {
      nombre: form.nombre,
      descripcion: form.descripcion,
    }, { headers: { Authorization: `Bearer ${res.data.token}` } });
    const planes = ['basico', 'pro', 'anual'];
    const plan = planes[planSeleccionado];
    const resPago = await axios.post('https://darksiders.shop/api/pagos/suscripcion',
      { plan },
      { headers: { Authorization: `Bearer ${res.data.token}` } });
    window.location.href = resPago.data.url;
  } catch (err: any) {
    setError(err.response?.data?.error || 'Error al registrar');
    setPaso(1);
  } finally {
    setCargando(false);
  }
};

  return (
    <main className="min-h-screen py-12 px-4" style={{background:'#0f0c29'}}>
      <div style={{position:'absolute', top:'10%', left:'25%', width:500, height:400, borderRadius:'50%', background:'rgba(240,147,251,0.07)', filter:'blur(80px)'}}/>

      <div className="max-w-2xl mx-auto relative z-10">
        <a href="/" className="flex items-center gap-2 mb-10">
          <div style={{width:36, height:36, background:'linear-gradient(135deg, #f093fb, #f5576c)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <span className="text-white font-bold">G</span>
          </div>
          <span className="text-white font-bold text-xl">GraduTech <span style={{color:'#f093fb'}}>Pro</span></span>
        </a>

        <div className="flex items-center gap-3 mb-10">
          {['Términos', 'Datos', 'Suscripción'].map((p, i) => (
            <React.Fragment key={p}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{background: i <= paso ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'rgba(255,255,255,0.1)', color:'white'}}>
                  {i < paso ? '✓' : i + 1}
                </div>
                <span className="text-sm" style={{color: i === paso ? '#f093fb' : 'rgba(255,255,255,0.4)'}}>{p}</span>
              </div>
              {i < 2 && <div className="flex-1 h-0.5" style={{background: i < paso ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'rgba(255,255,255,0.1)'}}/>}
            </React.Fragment>
          ))}
        </div>

        <div className="rounded-2xl p-8" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>

          {paso === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Términos y condiciones</h2>
              <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.4)'}}>Lee y acepta los términos para registrar tu agencia en GraduTech Pro</p>
              <div className="rounded-xl p-5 mb-6 overflow-y-auto" style={{background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.1)', maxHeight:300, whiteSpace:'pre-line', color:'rgba(255,255,255,0.6)', fontSize:13, lineHeight:1.8}}>
                {TERMINOS}
              </div>
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setAceptoTerminos(!aceptoTerminos)}>
                <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-all"
                  style={{background: aceptoTerminos ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'rgba(255,255,255,0.1)', border: aceptoTerminos ? 'none' : '1px solid rgba(255,255,255,0.2)'}}>
                  {aceptoTerminos && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-sm" style={{color:'rgba(255,255,255,0.7)'}}>He leído y acepto los términos y condiciones de GraduTech Pro</span>
              </div>
            </div>
          )}

          {paso === 1 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-white mb-2">Datos de tu agencia</h2>
              <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.4)'}}>Esta información aparecerá en tu perfil público dentro de GraduTech Pro</p>
              {error && (
                <div className="px-4 py-3 rounded-xl text-sm" style={{background:'rgba(245,87,108,0.2)', color:'#f5576c', border:'1px solid rgba(245,87,108,0.3)'}}>
                  {error}
                </div>
              )}
              {[
                { label:'Nombre de la agencia', key:'nombre', placeholder:'Ej: Estudio Foto Chiapas', type:'text' },
                { label:'Descripción', key:'descripcion', placeholder:'Ej: Especialistas en fotografía de graduación', type:'text' },
                { label:'Correo electrónico', key:'email', placeholder:'contacto@tuagencia.com', type:'email' },
                { label:'Contraseña', key:'password', placeholder:'Mínimo 8 caracteres', type:'password' },
                { label:'Confirmar contraseña', key:'confirmar', placeholder:'Repite tu contraseña', type:'password' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-2" style={{color:'rgba(255,255,255,0.7)'}}>{field.label}</label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={e => setForm({...form, [field.key]: e.target.value})}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}
                  />
                </div>
              ))}
            </div>
          )}

          {paso === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Plan de suscripción</h2>
              <p className="text-sm mb-8" style={{color:'rgba(255,255,255,0.4)'}}>Elige el plan que mejor se adapte a tu agencia</p>
              {PLANES.map((plan, i) => (
                <div key={i}
                  onClick={() => setPlanSeleccionado(i)}
                  className="rounded-2xl p-5 mb-4 cursor-pointer transition-all relative"
                  style={{
                    background: planSeleccionado === i ? 'linear-gradient(135deg, rgba(240,147,251,0.15), rgba(245,87,108,0.15))' : 'rgba(255,255,255,0.05)',
                    border: planSeleccionado === i ? '2px solid #f093fb' : '1px solid rgba(255,255,255,0.1)',
                    transform: planSeleccionado === i ? 'scale(1.02)' : 'scale(1)',
                  }}>
                  {i === 1 && planSeleccionado !== 1 && (
                    <span className="absolute -top-3 left-5 px-3 py-1 rounded-full text-xs font-bold" style={{background:'rgba(240,147,251,0.3)', color:'#f093fb'}}>
                      Más popular
                    </span>
                  )}
                  {planSeleccionado === i && (
                    <span className="absolute -top-3 left-5 px-3 py-1 rounded-full text-xs font-bold" style={{background:'linear-gradient(135deg, #f093fb, #f5576c)', color:'white'}}>
                      ✓ Seleccionado
                    </span>
                  )}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-bold text-lg">{plan.nombre}</h3>
                      <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.5)'}}>{plan.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold" style={{color: planSeleccionado === i ? '#f093fb' : 'rgba(255,255,255,0.6)'}}>{plan.precio}</span>
                      <span className="text-sm ml-1" style={{color:'rgba(255,255,255,0.4)'}}>/{plan.periodo}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 rounded-xl" style={{background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)'}}>
                <p className="text-sm" style={{color:'#4ade80'}}>✓ 30 días de prueba gratuita — Sin tarjeta de crédito requerida</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setPaso(p => Math.max(p - 1, 0))}
            disabled={paso === 0}
            className="px-6 py-3 rounded-xl font-medium transition-all"
            style={{background:'rgba(255,255,255,0.08)', color: paso === 0 ? 'rgba(255,255,255,0.2)' : 'white', border:'1px solid rgba(255,255,255,0.1)'}}>
            ← Anterior
          </button>
          {paso < 2 ? (
            <button
              onClick={() => setPaso(p => p + 1)}
              disabled={paso === 0 && !aceptoTerminos}
              className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
              style={{background:'linear-gradient(135deg, #f093fb, #f5576c)', opacity: paso === 0 && !aceptoTerminos ? 0.4 : 1}}>
              Siguiente →
            </button>
          ) : (
            <button
              onClick={registrar}
              disabled={cargando}
              className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
              style={{background:'linear-gradient(135deg, #f093fb, #f5576c)', opacity: cargando ? 0.7 : 1}}>
              {cargando ? 'Registrando...' : 'Registrar agencia ✓'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}