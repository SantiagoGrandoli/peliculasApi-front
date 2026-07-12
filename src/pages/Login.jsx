import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation } from 'wouter';
import { loginSchema } from '../schemas/authSchemas';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export default function Login() {
  const [, navigate] = useLocation();
  const login = useAuthStore((s) => s.login);
  const push = useToastStore((s) => s.push);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);
    try {
      const response = await authApi.login(data);
      login(response);
      push(`¡Bienvenido, ${response.user.userName}!`, 'success');
      navigate('/elementos');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 440 }}>
      <h1 className="display" style={{ fontSize: '2.4rem', marginBottom: 6 }}>
        Ingresar
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
        Accedé para calificar, guardar o administrar el catálogo.
      </p>

      {import.meta.env.VITE_USE_MOCK_AUTH !== 'false' && (
        <div className="badge" style={{ display: 'block', marginBottom: 16, padding: '8px 14px' }}>
          Modo demo: el login funciona sin backend (localStorage).
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card" style={{ padding: 24 }}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="tu@email.com" {...register('email')} />
          {errors.email && <span className="field-error">{errors.email.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" placeholder="••••••••" {...register('password')} />
          {errors.password && <span className="field-error">{errors.password.message}</span>}
        </div>

        {serverError && (
          <p className="field-error" style={{ marginBottom: 16 }}>
            {serverError}
          </p>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p style={{ marginTop: 18, fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          ¿No tenés cuenta? <Link href="/register" style={{ color: 'var(--gold)' }}>Registrate</Link>
        </p>

        <div
          style={{
            marginTop: 18,
            paddingTop: 16,
            borderTop: '1px solid var(--border)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <strong>Usuarios de prueba (locales):</strong>
          <br />
          admin@movies.com / Admin123! (rol Admin)
          <br />
          user@movies.com / User123! (rol User)
        </div>
      </form>
    </div>
  );
}
