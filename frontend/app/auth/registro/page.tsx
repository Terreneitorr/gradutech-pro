'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Registro() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setCargando(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/auth/registro', {
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        rol: 'USUARIO'
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{background:'#0f0c29'}}>
      <div style={{position:'absolute', top:'20%', right:'30%', width:400, height:400, borderRadius:'50%', background:'rgba(245,87,108,0.1)', filter:'blur(80px)'}}/>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div style={{width:40, height:40, background:'linear-gradient(135deg, #f093fb, #f5576c)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-white font-bold text-2xl">GraduTech <span style={{color:'#f093fb'}}>Pro</span></span>
          </div>
          <h1 className="text-3xl font-bold text-white">Crea tu cuenta</h1>
          <p className="mt-2" style={{color:'rgba(255,255,255,0.5)'}}>Regístrate gratis y encuentra tu agencia</p>
        </div>

        <div className="rounded-2xl p-8" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{background:'rgba(245,87,108,0.2)', color:'#f5576c', border:'1px solid rgba(245,87,108,0.3)'}}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'rgba(255,255,255,0.7)'}}>Nombre completo</label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={e => setForm({...form, nombre: e.target.value})}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'rgba(255,255,255,0.7)'}}>Correo electrónico</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 rounded-xl outline-none"
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
                placeholder="Mínimo 8 caracteres"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'rgba(255,255,255,0.7)'}}>Confirmar contraseña</label>
              <input
                type="password"
                required
                value={form.confirmar}
                onChange={e => setForm({...form, confirmar: e.target.value})}
                placeholder="Repite tu contraseña"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white'}}
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3 rounded-xl font-bold text-white transition-all"
              style={{background:'linear-gradient(135deg, #f093fb, #f5576c)', opacity: cargando ? 0.7 : 1}}
            >
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
          <p className="text-center mt-6 text-sm" style={{color:'rgba(255,255,255,0.4)'}}>
            ¿Ya tienes cuenta?{' '}
            <a href="/auth/login" style={{color:'#f093fb'}} className="font-medium">Inicia sesión</a>
          </p>
        </div>
      </div>
    </main>
  );
}