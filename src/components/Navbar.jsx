import React from 'react';
import { Link } from 'wouter';

export default function Navbar() {
  return (
    <nav
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        background: '#111',
        color: '#fff',
      }}
    >
      <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>
        Inicio
      </Link>
      <Link href="/elementos" style={{ color: '#fff', textDecoration: 'none' }}>
        Elementos
      </Link>
      <Link href="/login" style={{ color: '#fff', textDecoration: 'none' }}>
        Login
      </Link>
      <Link href="/register" style={{ color: '#fff', textDecoration: 'none' }}>
        Registro
      </Link>
      <Link href="/admin" style={{ color: '#fff', textDecoration: 'none' }}>
        Admin
      </Link>
    </nav>
  );
}
