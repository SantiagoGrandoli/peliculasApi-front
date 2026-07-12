import { Link } from 'wouter';

export default function Home() {
  return (
    <div className="container page">
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 18,
          padding: '60px 0 40px',
          borderBottom: '1px solid var(--border)',
          marginBottom: 40,
        }}
      >
        <span className="badge">Catálogo colaborativo</span>
        <h1 className="display" style={{ fontSize: '3.4rem', lineHeight: 1, margin: 0 }}>
          Tu cartelera,
          <br />
          <span style={{ color: 'var(--gold)' }}>siempre en función.</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: 520, fontSize: '1.05rem' }}>
          Explorá el catálogo, buscá por título, id o director, y filtrá por género.
          Si tenés una cuenta de administrador, además vas a poder cargar nuevas
          películas y ver estadísticas del catálogo.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/elementos" className="btn btn-primary">
            Ver películas
          </Link>
          <Link href="/register" className="btn btn-ghost">
            Crear cuenta
          </Link>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        <FeatureCard title="Buscá y filtrá" text="Por id, nombre o género, con paginación." />
        <FeatureCard title="Roles claros" text="Usuarios y administradores, cada uno con sus permisos." />
        <FeatureCard title="Panel admin" text="Estadísticas del catálogo y gestión de películas." />
      </section>
    </div>
  );
}

function FeatureCard({ title, text }) {
  return (
    <div className="card" style={{ padding: 22 }}>
      <h3 style={{ margin: '0 0 8px', color: 'var(--gold)', fontSize: '1.3rem' }}>{title}</h3>
      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>{text}</p>
    </div>
  );
}
