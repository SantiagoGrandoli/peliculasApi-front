import { Link, useLocation } from 'wouter';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const push = useToastStore((s) => s.push);
  const [, navigate] = useLocation();
  const isAdmin = Array.isArray(user?.roles) ? user.roles.includes('Admin') : user?.roles === 'Admin';

  const handleLogout = () => {
    logout();
    push('Sesión cerrada correctamente.', 'success');
    navigate('/');
  };

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(13,14,19,0.85)',
        backdropFilter: 'blur(6px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            className="display"
            style={{ fontSize: '1.6rem', color: 'var(--gold)', letterSpacing: '0.08em' }}
          >
            CINE<span style={{ color: 'var(--text)' }}>FICHA</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Link href="/elementos" style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Películas
          </Link>

          {isAuthenticated && (
            <Link href="/" style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Listas
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link href="/admin" style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Admin
            </Link>
          )}

          {console.log(user)}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="badge">{isAdmin ? '★ Admin' : user?.userName}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Ingresar
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Crear cuenta
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
