'use client';

import { useState } from 'react';
import axiosClient from '@/lib/axiosClient';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

interface LoginResponse {
  token?: string;
  accessToken?: string;
  usuario?: {
    rol?: string;
    role?: string;
  };
  user?: {
    rol?: string;
    role?: string;
  };
}

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const res = await axiosClient.post<LoginResponse>('/auth/login', form);

      console.log("LOGIN RESPONSE:", res.data);

      // ✅ TOKEN seguro
      const token = res.data.token || res.data.accessToken;

      if (!token) {
        throw new Error('No se recibió token');
      }

      localStorage.setItem('token', token);

      // ✅ USUARIO seguro
      const usuario = res.data.usuario || res.data.user;

      if (!usuario) {
        throw new Error('No se recibió usuario');
      }

      localStorage.setItem('usuario', JSON.stringify(usuario));

      // ✅ ROL seguro
      const rol = (usuario.rol || usuario.role || '').toUpperCase();

      localStorage.setItem('rol', rol);

      console.log("ROL:", rol);

      // ✅ REDIRECCIÓN
      if (rol === 'ADMIN') {
        router.push('/admin');
      } else if (rol === 'AGENCY' || rol === 'AGENCIA') {
        router.push('/agencia/bienvenida');
      } else {
        router.push('/');
      }

    } catch (error) {
      const err = error as AxiosError<any>;

      console.error(err);

      setError(
        err.response?.data?.error ||
        err.message ||
        'Error al iniciar sesión'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{background:'#0f0c29'}}>
      <div className="relative z-10 w-full max-w-md">

        {error && <p style={{color:'red'}}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
          />

          <button type="submit" disabled={cargando}>
            {cargando ? 'Cargando...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}