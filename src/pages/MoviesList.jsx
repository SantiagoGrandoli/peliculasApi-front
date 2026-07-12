import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { moviesApi } from '../api/moviesApi';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const PAGE_SIZE = 8;

export default function MoviesList() {

  const [search, setSearch] = useState('');
  const [genreId, setGenreId] = useState('');
  const [page, setPage] = useState(1);

  const [genres, setGenres] = useState([]);
  const [data, setData] = useState({ data: [], totalRecords: 0, totalPages: 1, page: 1, pageSize: PAGE_SIZE });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    moviesApi
      .getGenres()
      .then(setGenres)
      .catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, genreId]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    const timeoutId = setTimeout(() => {
      moviesApi
        .getAll({ search: search || undefined, genreId: genreId || undefined, page, pageSize: PAGE_SIZE })
        .then((res) => {
          if (active) setData(res);
        })
        .catch((err) => {
          if (active) setError(err.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 350); 

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [search, genreId, page]);

  const items = data.data || [];
  const trimmedSearch = search.trim();
  const isNumericSearch = /^\d+$/.test(trimmedSearch);

  return (
    <div className="container page">
      {isNumericSearch && (
        <Link
          href={`/elementos/${trimmedSearch}`}
          className="card"
          style={{ display: 'block', padding: '12px 18px', marginBottom: 20, color: 'var(--gold)' }}
        >
          ¿Buscás la película con id #{trimmedSearch}? Ir directo a la ficha →
        </Link>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 className="display" style={{ fontSize: '2.6rem', margin: 0 }}>
            Catálogo
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>
            {data.totalRecords} película{data.totalRecords !== 1 ? 's' : ''} en total
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            type="search"
            placeholder="Buscar por título o director..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '10px 14px',
              borderRadius: 6,
              minWidth: 240,
            }}
          />
          <select
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '10px 14px',
              borderRadius: 6,
            }}
          >
            <option value="">Todos los géneros</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.genreName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <Loader label="Buscando películas..." />}

      {!loading && error && (
        <div className="empty-state">
          <h3>No se pudo cargar el catálogo</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="empty-state">
          <h3>Sin resultados</h3>
          <p>Probá con otro término de búsqueda o cambiá el filtro de género.</p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 20,
            }}
          >
            {items.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, marginTop: 36 }}>
            <button
              className="btn btn-ghost btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Anterior
            </button>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Página {data.page} de {Math.max(1, data.totalPages)}
            </span>
            <button
              className="btn btn-ghost btn-sm"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
