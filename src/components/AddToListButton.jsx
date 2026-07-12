import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { listsApi } from '../api/listsApi';
import { useToastStore } from '../store/toastStore';

export default function AddToListButton({ movieId }) {
  const push = useToastStore((s) => s.push);
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      listsApi
        .getAll()
        .then((res) => setLists(Array.isArray(res) ? res : res?.data || []))
        .catch(() => setLists([]))
        .finally(() => setLoading(false));
    }
  };

  const handleAdd = async (list) => {
    setAdding(list.id);
    try {
      await listsApi.addMovie(list.id, movieId);
      push(`Agregada a "${list.name}".`, 'success');
      setOpen(false);
    } catch (err) {
      push(err.message, 'error');
    } finally {
      setAdding(null);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button className="btn btn-ghost" onClick={toggleOpen}>
        + Agregar a lista
      </button>

      {open && (
        <div
          className="card"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            zIndex: 10,
            minWidth: 240,
            padding: 12,
          }}
        >
          {loading && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cargando listas...</p>}

          {!loading && lists.length === 0 && (
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No tenés listas todavía.{' '}
              <Link href="/mis-listas" style={{ color: 'var(--gold)' }}>
                Creá una acá
              </Link>
              .
            </p>
          )}

          {!loading &&
            lists.map((list) => (
              <button
                key={list.id}
                onClick={() => handleAdd(list)}
                disabled={adding === list.id}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text)',
                  padding: '8px 6px',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {adding === list.id ? 'Agregando...' : list.name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}