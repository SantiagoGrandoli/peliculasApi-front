# Películas API Frontend

Frontend de la aplicación desarrollada con React + Vite para consumir una API de películas y gestionar autenticación, listas y panel de administración.

## Requisitos previos

- Node.js 18 o superior
- pnpm 8 o superior

## Instalación

1. Clonar el repositorio.
2. Ingresar al directorio del frontend:
   ```bash
   cd peliculasApi-front
   ```
3. Instalar dependencias:
   ```bash
   pnpm install
   ```

## Ejecutar en modo desarrollo

```bash
pnpm dev
```

La aplicación quedará disponible en:

- http://localhost:5173

## Build para producción

Generar la build optimizada:

```bash
pnpm build
```

Previsualizar la build localmente:

```bash
pnpm preview
```

## Configuración

Crear un archivo llamado `.env.local` en la raíz del proyecto con las siguientes variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK_AUTH=false
```

### Variables disponibles

- `VITE_API_URL`: URL base de la API backend que consume el frontend.
- `VITE_USE_MOCK_AUTH`: si se deja en `false`, se usa la autenticación real con el backend. Si no se define o se deja en `true`, la app usará el flujo mock de autenticación.

## Configuración del backend

Este frontend espera que el backend esté corriendo y sea accesible desde la URL configurada en `VITE_API_URL`.

Si el backend es ASP.NET Core con Entity Framework Core, la cadena de conexión correspondiente debería configurarse en el proyecto backend, por ejemplo en `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=PeliculasDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

## Scripts útiles

```bash
pnpm lint
pnpm build
pnpm dev
```

