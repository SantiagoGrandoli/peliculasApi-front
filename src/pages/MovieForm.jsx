import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useParams, Link } from 'wouter';
import { movieSchema } from '../schemas/movieSchema';
import { moviesApi } from '../api/moviesApi';
import { useToastStore } from '../store/toastStore';
import Loader from '../components/Loader';

const normalizeGenreIds = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => Number(item))
      .filter((item) => Number.isFinite(item));
  }

  if (value === null || value === undefined || value === '') {
    return [];
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? [numericValue] : [];
};

export default function MovieForm() {
  const params = useParams();
  const isEdit = Boolean(params.id);
  const [, navigate] = useLocation();
  const push = useToastStore((s) => s.push);

  const [genres, setGenres] = useState([]);
  const [loadingMovie, setLoadingMovie] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: '',
      director: '',
      year: new Date().getFullYear(),
      genresIds: [],
      description: '',
      posterUrl: '',
    },
  });

  useEffect(() => {
    moviesApi.getGenres().then(setGenres).catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    moviesApi
      .getById(params.id)
      .then((movie) => {
        reset({
          title: movie.title,
          director: movie.director,
          year: movie.year,
          genresIds: normalizeGenreIds(
            (movie.genres || []).map((g) => g.id ?? g.genreId ?? g.genre?.id)
          ),
          description: movie.description || '',
          posterUrl: movie.posterUrl || '',
        });
      })
      .catch((err) => setServerError(err.message))
      .finally(() => setLoadingMovie(false));
  }, [isEdit, params.id, reset]);

  const onSubmit = async (data) => {
    setServerError('');
    setSaving(true);
    const payload = {
      title: data.title,
      director: data.director,
      year: data.year,
      genresIds: normalizeGenreIds(data.genresIds),
      description: data.description || null,
      posterUrl: data.posterUrl || null,
    };
    try {
      if (isEdit) {
        await moviesApi.update(params.id, payload);
        push('Película actualizada.', 'success');
      } else {
        await moviesApi.create(payload);
        push('Película creada.', 'success');
      }
      navigate('/admin');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingMovie) {
    return (
      <div className="container page">
        <Loader label="Cargando película..." />
      </div>
    );
  }

  const onError = (errors) => console.log(errors);

  return (
    <div className="container page" style={{ maxWidth: 640 }}>
      <Link href="/admin" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        ← Volver al panel admin
      </Link>

      <h1 className="display" style={{ fontSize: '2.4rem', margin: '14px 0 24px' }}>
        {isEdit ? 'Editar película' : 'Nueva película'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate className="card" style={{ padding: 24 }}>
        <div className="field">
          <label htmlFor="title">Título</label>
          <input id="title" {...register('title')} />
          {errors.title && <span className="field-error">{errors.title.message}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="field">
            <label htmlFor="director">Director</label>
            <input id="director" {...register('director')} />
            {errors.director && <span className="field-error">{errors.director.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="year">Año de estreno</label>
            <input id="year" type="number" {...register('year')} />
            {errors.year && <span className="field-error">{errors.year.message}</span>}
          </div>
        </div>

        <div className="field">
          <label>Géneros</label>
          <Controller
            control={control}
            name="genresIds"
            render={({ field }) => {
              const selectedValues = normalizeGenreIds(field.value);

              return (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 10,
                    padding: '10px 12px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                  }}
                >
                {genres.length === 0 && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No hay géneros cargados todavía en el backend (creálos primero vía /api/genre).
                  </span>
                )}
                {genres.map((g) => {
                  const selectedId = Number(g.id);
                  const checked = selectedValues.includes(selectedId);
                  return (
                    <label
                      key={g.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: '0.85rem',
                        color: checked ? 'var(--gold)' : 'var(--text)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...selectedValues, selectedId]);
                          } else {
                            field.onChange(selectedValues.filter((id) => Number(id) !== selectedId));
                          }
                        }}
                      />
                      {g.genreName}
                    </label>
                  );
                })}
                </div>
              );
            }}
          />
          {errors.genresIds && <span className="field-error">{errors.genresIds.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="description">Descripción</label>
          <textarea id="description" rows={4} {...register('description')} />
          {errors.description && <span className="field-error">{errors.description.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="posterUrl">URL del póster (opcional)</label>
          <input id="posterUrl" placeholder="https://..." {...register('posterUrl')} />
          {errors.posterUrl && <span className="field-error">{errors.posterUrl.message}</span>}
        </div>

        {serverError && (
          <p className="field-error" style={{ marginBottom: 16 }}>
            {serverError}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear película'}
        </button>
      </form>
    </div>
  );
}