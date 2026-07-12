import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { moviesApi } from '../api/moviesApi';
import { useToastStore } from '../store/toastStore';
import Loader from '../components/Loader';

function computeGenreDistribution(movies) {
  const counts = {};
  for (const m of movies) {
    for (const g of m.genres || []) {
      counts[g.genreName] = (counts[g.genreName] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
}

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const push = useToastStore((s) => s.push);

  const loadData = () => {
    setLoading(true);
    setError('');
    Promise.all([moviesApi.getStats(), moviesApi.getAll({ page: 1, pageSize: 1000 })])
      .then(([statsData, moviesData]) => {
        setStats(statsData);
        setMovies(moviesData.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (movie) => {
    if (!confirm(`¿Eliminar "${movie.title}"?`)) return;
    try {
      await moviesApi.remove(movie.id);
      push('Película eliminada.', 'success');
      loadData();
    } catch (err) {
      push(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="container page">
        <Loader label="Cargando panel de administración..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page">
        <div className="empty-state">
          <h3>No se pudo cargar el panel</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const genreDistribution = computeGenreDistribution(movies);

  return (
    <div className="container page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 className="display" style={{ fontSize: '2.6rem', margin: 0 }}>
            Panel admin
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Estadísticas y gestión del catálogo.</p>
        </div>
        <Link href="/admin/elementos/new" className="btn btn-primary">
          + Nueva película
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18, marginBottom: 32 }}>
        <StatCard label="Total de películas" value={stats.totalMovies} />
        <StatCard label="Total de usuarios" value={stats.totalUsers} />
        <StatCard label="Total de valoraciones" value={stats.totalRatings} />
        <StatCard label="Total de reseñas" value={stats.totalReviews} />
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 32 }}>
        <h3 style={{ marginTop: 0 }}>Películas por género</h3>
        {genreDistribution.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Todavía no hay películas con géneros cargados.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={genreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2d38" />
              <XAxis dataKey="genre" stroke="#9298a8" fontSize={12} />
              <YAxis stroke="#9298a8" allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#1d2029', border: '1px solid #2a2d38', borderRadius: 8 }}
                labelStyle={{ color: '#f1f0ec' }}
              />
              <Bar dataKey="count" fill="#e3b341" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <h3 style={{ margin: 0, padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          Gestión de películas
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <th style={cellStyle}>ID</th>
              <th style={cellStyle}>Título</th>
              <th style={cellStyle}>Géneros</th>
              <th style={cellStyle}>Año</th>
              <th style={cellStyle}></th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={cellStyle}>#{m.id}</td>
                <td style={cellStyle}>{m.title}</td>
                <td style={cellStyle}>{(m.genres || []).map((g) => g).join(', ') || '—'}</td>
                <td style={cellStyle}>{m.year}</td>
                <td style={{ ...cellStyle, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <Link href={`/admin/elementos/${m.id}/editar`} className="btn btn-ghost btn-sm">
                    Editar
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card" style={{ padding: '18px 20px' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      <div className="display" style={{ fontSize: '2.2rem', color: 'var(--gold)' }}>{value}</div>
    </div>
  );
}

const cellStyle = { padding: '12px 24px', fontSize: '0.9rem' };
