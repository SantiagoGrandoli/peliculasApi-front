import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'wouter';
import { moviesApi } from '../api/moviesApi';
import { useToastStore } from '../store/toastStore';
import Loader from '../components/Loader';
import { genreSchema } from '../schemas/genreSchema';

export default function GenreAdmin() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const push = useToastStore((s) => s.push);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(genreSchema),
    defaultValues: { genreName: '' },
  });

  const loadGenres = () => {
    setLoading(true);
    moviesApi
      .getGenres()
      .then(setGenres)
      .catch(() => setGenres([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGenres();
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editingId) {
        await moviesApi.updateGenre(editingId, data);
        push('Género actualizado.', 'success');
      } else {
        await moviesApi.createGenre(data);
        push('Género creado.', 'success');
      }
      reset({ genreName: '' });
      setEditingId(null);
      loadGenres();
    } catch (err) {
      push(err.message || 'No se pudo guardar el género.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (genre) => {
    setEditingId(genre.id);
    reset({ genreName: genre.genreName || '' });
  };

  const handleDelete = async (genre) => {
    if (!confirm(`¿Eliminar el género "${genre.genreName}"?`)) return;
    try {
      await moviesApi.removeGenre(genre.id);
      push('Género eliminado.', 'success');
      loadGenres();
    } catch (err) {
      push(err.message || 'No se pudo eliminar el género.', 'error');
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 860 }}>
      <Link href="/admin" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        ← Volver al panel admin
      </Link>

      <h1 className="display" style={{ fontSize: '2.4rem', margin: '14px 0 24px' }}>
        Gestión de géneros
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div className="field">
          <label htmlFor="genreName">Nombre del género</label>
          <input id="genreName" {...register('genreName')} />
          {errors.genreName && <span className="field-error">{errors.genreName.message}</span>}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear género'}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setEditingId(null);
                reset({ genreName: '' });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <h3 style={{ margin: 0, padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          Géneros actuales
        </h3>

        {loading ? (
          <div style={{ padding: 24 }}><Loader label="Cargando géneros..." /></div>
        ) : genres.length === 0 ? (
          <p style={{ padding: '24px', color: 'var(--text-muted)' }}>No hay géneros cargados.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <th style={cellStyle}>ID</th>
                <th style={cellStyle}>Nombre</th>
                <th style={cellStyle}></th>
              </tr>
            </thead>
            <tbody>
              {genres.map((genre) => (
                <tr key={genre.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={cellStyle}>#{genre.id}</td>
                  <td style={cellStyle}>{genre.genreName}</td>
                  <td style={{ ...cellStyle, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(genre)}>
                      Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(genre)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const cellStyle = { padding: '12px 24px', fontSize: '0.9rem' };
