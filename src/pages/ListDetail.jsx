import { useEffect, useState } from 'react';
import { Link, useParams } from 'wouter';
import { listsApi } from '../api/listsApi';
import { useToastStore } from '../store/toastStore';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

export default function ListDetail() {
  const { id } = useParams();
  const push = useToastStore((s) => s.push);

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    listsApi
      .getById(id)
      .then(setList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleRemoveMovie = async (movie) => {
    try {
      await listsApi.removeMovie(id, movie.id);
      push('Película quitada de la lista.', 'success');
      load();
    } catch (err) {
      push(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="container page">
        <Loader label="Cargando lista..." />
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="container page">
        <div className="empty-state">
          <h3>No se pudo cargar la lista</h3>
          <p>{error}</p>
          <Link href="/mis-listas" className="btn btn-ghost" style={{ marginTop: 12 }}>
            Volver a mis listas
          </Link>
        </div>
      </div>
    );
  }

  const movies = (list.movies || []).map((m) => m.movie ?? m);

  return (
    <div className="container page">
      <Link href="/mis-listas" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        ← Volver a mis listas
      </Link>

      <h1 className="display" style={{ fontSize: '2.6rem', margin: '14px 0 24px' }}>
        {list.name}
      </h1>

      {movies.length === 0 ? (
        <div className="empty-state">
          <h3>Esta lista está vacía</h3>
          <p>
            Andá al <Link href="/elementos" style={{ color: 'var(--gold)' }}>catálogo</Link> y agregá
            películas a esta lista.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 20,
          }}
        >
          {movies.map((movie) => (
            <div key={movie.id} style={{ position: 'relative' }}>
              <MovieCard movie={movie} />
              <button
                className="btn btn-danger btn-sm"
                style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, background: 'rgba(13,14,19,0.85)' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveMovie(movie);
                }}
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}