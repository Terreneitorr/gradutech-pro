'use client';
import { useState } from 'react';
import axiosClient from '@/lib/axiosClient';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setCargando(true);
  setError('');

  try {
    const res = await axiosClient.post('/auth/login', form);

    console.log("RESPUESTA LOGIN:", res.data); // 👈 IMPORTANTE

    localStorage.setItem('token', res.data.token);

    // 🔥 Detectar correctamente el usuario
    const usuario = res.data.usuario || res.data.user;
    localStorage.setItem('usuario', JSON.stringify(usuario));

    // 🔥 Detectar rol correctamente (rol o role)
      const rol = (usuario?.rol || usuario?.role || '').toUpperCase();

      localStorage.setItem('rol', rol);

      if (rol === 'ADMIN') {
        router.push('/admin');
      } else if (rol === 'AGENCY' || rol === 'AGENCIA') {
        router.push('/agencia/bienvenida');
      } else {
        router.push('/');
      }

  } catch (err: any) {
    setError(err.response?.data?.error || 'Error al iniciar sesión');
  } finally {
    setCargando(false);
  }
};

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{background:'#0f0c29'}}>
      <div style={{position:'absolute', top:'20%', left:'30%', width:400, height:400, borderRadius:'50%', background:'rgba(240,147,251,0.1)', filter:'blur(80px)'}}/>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div style={{width:40, height:40, background:'linear-gradient(135deg, #f093fb, #f5576c)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-white font-bold text-2xl">GraduTech <span style={{color:'#f093fb'}}>Pro</span></span>
          </div>
          <h1 className="text-3xl font-bold text-white">Bienvenido de vuelta</h1>
          <p className="mt-2" style={{color:'rgba(255,255,255,0.5)'}}>Inicia sesión en tu cuenta</p>
        </div>

        <div className="rounded-2xl p-8" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{background:'rgba(245,87,108,0.2)', color:'#f5576c', border:'1px solid rgba(245,87,108,0.3)'}}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'rgba(255,255,255,0.7)'}}>Correo electrónico</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'rgba(255,255,255,0.7)'}}>Contraseña</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3 rounded-xl font-bold text-white transition-all"
              style={{background:'linear-gradient(135deg, #f093fb, #f5576c)', opacity: cargando ? 0.7 : 1}}
            >
              {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
          <p className="text-center mt-6 text-sm" style={{color:'rgba(255,255,255,0.4)'}}>
            ¿No tienes cuenta?{' '}
            <a href="/auth/registro" style={{color:'#f093fb'}} className="font-medium">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </main>
  );
}