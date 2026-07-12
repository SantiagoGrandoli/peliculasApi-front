import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="container page">
      <div className="empty-state">
        <h1 className="display" style={{ fontSize: '3rem', color: 'var(--gold)' }}>
          404
        </h1>
        <p>Esta escena no está en el guion.</p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: 16 }}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
