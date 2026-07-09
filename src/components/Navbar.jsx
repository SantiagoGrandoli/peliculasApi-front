import React from 'react'
import { Link } from 'wouter'

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li><strong>Peliculas API</strong></li>
      </ul>
      <ul>
        <li><Link href="/" class="contrast">Inicio</Link></li>
        <li><Link href="/login" class="contrast">Iniciar Sesion</Link></li>
        <li><Link href="/register" class="contrast">Registrarse</Link></li>
      </ul>
    </nav>
  )
}
