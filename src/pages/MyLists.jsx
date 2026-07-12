import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { listsApi } from '../api/listsApi';
import { useToastStore } from '../store/toastStore';
import Loader from '../components/Loader';

export default function MyLists() {
  const push = useToastStore((s) => s.push);

  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    setError('');
    listsApi
      .getAll()
      .then((res) => setLists(Array.isArray(res) ? res : res?.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await listsApi.create(newName.trim());
      setNewName('');
      push('Lista creada.', 'success');
      load();
    } catch (err) {
      push(err.message, 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (list) => {
    if (!confirm(`¿Eliminar la lista "${list.name}"?`)) return;
    try {
      await listsApi.remove(list.id);
      push('Lista eliminada.', 'success');
      load();
    } catch (err) {
      push(err.message, 'error');
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 720 }}>
      <h1 className="display" style={{ fontSize: '2.6rem', margin: '0 0 4px' }}>
        Mis listas
      </h1>
      <p style={{ color: 'var(--text-muted)', margin: '0 0 28px' }}>
        Organizá las películas que querés ver en tus propias listas.
      </p>

      <form
        onSubmit={handleCreate}
        className="card"
        style={{ padding: 20, marginBottom: 28, display: 'flex', gap: 10 }}
      >
        <input
          type="text"
          placeholder="Nombre de la nueva lista (ej: Para ver el finde)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{
            flex: 1,
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            padding: '10px 14px',
            borderRadius: 6,
          }}
        />
        <button type="submit" className="btn btn-primary" disabled={creating || !newName.trim()}>
          {creating ? 'Creando...' : '+ Crear lista'}
        </button>
      </form>

      {loading && <Loader label="Cargando tus listas..." />}

      {!loading && error && (
        <div className="empty-state">
          <h3>No se pudieron cargar tus listas</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && lists.length === 0 && (
        <div className="empty-state">
          <h3>Todavía no tenés listas</h3>
          <p>Creá una arriba para empezar a guardar películas.</p>
        </div>
      )}

      {!loading && !error && lists.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {lists.map((list) => (
            <div
              key={list.id}
              className="card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{list.name}</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {(list.movies?.length ?? list.movieCount ?? 0)} película(s)
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/mis-listas/${list.id}`} className="btn btn-ghost btn-sm">
                  Ver
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(list)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}