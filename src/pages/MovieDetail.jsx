import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { moviesApi } from '../api/moviesApi';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import Loader from '../components/Loader';

function getAverage(ratings) {
  if (!ratings || ratings.length === 0) return null;
  return ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length;
}

export default function MovieDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = Boolean(user?.roles?.includes('Admin'));
  const push = useToastStore((s) => s.push);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(null);
  const [ratingDraft, setRatingDraft] = useState(5);
  const [reviewDraft, setReviewDraft] = useState('');
  const [savingRating, setSavingRating] = useState(false);
  const [savingReview, setSavingReview] = useState(false);

  const loadMovie = () => {
    setLoading(true);
    setError('');
    moviesApi
      .getById(id)
      .then(setMovie)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMovie();
    moviesApi.getReviews(id).then(setReviews).catch(() => setReviews([])
  );

    if (isAuthenticated) {
      moviesApi
        .getMyRating(id)
        .then((r) => {
          if (r) {
            setMyRating(r);
            setRatingDraft(Number(r.score));
          }
        })
        .catch(() => {});
    }
  }, [id, isAuthenticated]);

  const handleDelete = async () => {
    if (!confirm(`¿Seguro que querés eliminar "${movie.title}"?`)) return;
    setDeleting(true);
    try {
      await moviesApi.remove(id);
      push('Película eliminada.', 'success');
      navigate('/elementos');
    } catch (err) {
      push(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleRate = async () => {
    setSavingRating(true);
    try {
      const result = await moviesApi.upsertRating(id, ratingDraft);
      setMyRating(result);
      push('¡Gracias por tu calificación!', 'success');
      loadMovie(); // refresca el promedio
    } catch (err) {
      push(err.message, 'error');
    } finally {
      setSavingRating(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewDraft.trim().length < 10) {
      push('La reseña debe tener al menos 10 caracteres.', 'error');
      return;
    }
    setSavingReview(true);
    try {
      await moviesApi.createReview(id, { content: reviewDraft, containsSpoilers: false });
      setReviewDraft('');
      push('Reseña publicada.', 'success');
      moviesApi.getReviews(id).then(setReviews);
    } catch (err) {
      push(err.message, 'error');
    } finally {
      setSavingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container page">
        <Loader label="Cargando ficha..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container page">
        <div className="empty-state">
          <h3>No se encontró la película</h3>
          <p>{error}</p>
          <Link href="/elementos" className="btn btn-ghost" style={{ marginTop: 12 }}>
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const avg = getAverage(movie.ratings);
  const genreNames = movie?.genres.map((g) => g.genreName).join(', ') || 'Sin género cargado';
  

  return (
    <div className="container page">
      <Link href="/elementos" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        ← Volver al catálogo
      </Link>

      <div
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: 32,
          padding: 32,
          marginTop: 20,
        }}
      >
        <div style={{ aspectRatio: '2 / 3', borderRadius: 10, overflow: 'hidden', background: 'var(--surface-2)' }}>
          {movie.posterUrl && (
            <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>

        <div>
          <span className="badge">{genreNames}</span>
          <h1 className="display" style={{ fontSize: '2.6rem', margin: '10px 0 6px' }}>
            {movie.title}
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 20px' }}>
            #{movie.id} · {movie.year} · Dirigida por {movie.director}
            {avg !== null && ` · ★ ${avg.toFixed(1)}/5 (${movie.ratings.length} valoraciones)`}
          </p>
          <p style={{ lineHeight: 1.6 }}>{movie.description}</p>

          {isAdmin && (
            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <Link href={`/admin/elementos/${movie.id}/editar`} className="btn btn-ghost">
                Editar
              </Link>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Tu calificación</h3>
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={ratingDraft}
              onChange={(e) => setRatingDraft(Number(e.target.value))}
              style={{ maxWidth: 240 }}
            />
            <span style={{ fontWeight: 700, color: 'var(--gold)', minWidth: 50 }}>★ {ratingDraft.toFixed(1)}</span>
            <button className="btn btn-primary btn-sm" onClick={handleRate} disabled={savingRating}>
              {savingRating ? 'Guardando...' : myRating ? 'Actualizar' : 'Calificar'}
            </button>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>
            <Link href="/login" style={{ color: 'var(--gold)' }}>Ingresá</Link> para calificar esta película.
          </p>
        )}
      </div>

      <div className="card" style={{ padding: 24, marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Reseñas ({reviews.length})</h3>

        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} style={{ marginBottom: 20 }}>
            <div className="field">
              <textarea
                rows={3}
                placeholder="Escribí tu reseña (mínimo 10 caracteres)..."
                value={reviewDraft}
                onChange={(e) => setReviewDraft(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-ghost btn-sm" disabled={savingReview}>
              {savingReview ? 'Publicando...' : 'Publicar reseña'}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Todavía no hay reseñas para esta película.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {reviews.map((r) => (
              <div key={r.id} style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <strong style={{ color: 'var(--gold)' }}>{r.userName}</strong>
                {r.containsSpoilers && <span className="badge" style={{ marginLeft: 8 }}>Spoilers</span>}
                <p style={{ margin: '6px 0 0' }}>{r.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}