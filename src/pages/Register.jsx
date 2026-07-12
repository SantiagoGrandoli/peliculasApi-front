import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation } from 'wouter';
import { registerSchema } from '../schemas/authSchemas';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export default function Register() {
  const [, navigate] = useLocation();
  const login = useAuthStore((s) => s.login);
  const push = useToastStore((s) => s.push);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);
    try {
      const response = await authApi.register({
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      login(response);
      push('Cuenta creada. ¡Ya estás dentro!', 'success');
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
        Crear cuenta
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
        Los registros nuevos se crean con rol de usuario estándar.
      </p>

      {import.meta.env.VITE_USE_MOCK_AUTH !== 'false' && (
        <div className="badge" style={{ display: 'block', marginBottom: 16, padding: '8px 14px' }}>
          Modo demo: el registro se guarda en este navegador (localStorage), sin backend.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card" style={{ padding: 24 }}>
        <div className="field">
          <label htmlFor="username">Usuario</label>
          <input id="username" placeholder="tu_usuario" {...register('username')} />
          {errors.username && <span className="field-error">{errors.username.message}</span>}
        </div>

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

        <div className="field">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} />
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword.message}</span>
          )}
        </div>

        {serverError && (
          <p className="field-error" style={{ marginBottom: 16 }}>
            {serverError}
          </p>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p style={{ marginTop: 18, fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          ¿Ya tenés cuenta? <Link href="/login" style={{ color: 'var(--gold)' }}>Ingresá</Link>
        </p>
      </form>
    </div>
  );
}
