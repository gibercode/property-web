# INMO

Frontend React para la app de inmuebles.

## Requisitos

- Node.js
- pnpm
- `property-api` levantado en `http://localhost:5001/api`

## Instalacion

```bash
pnpm install
```

## Variables de entorno

Crea un archivo `.env` si necesitas cambiar la URL de la API:

```bash
VITE_API_URL=http://localhost:5001/api
```

Si no se define, el proyecto usa esa misma URL por defecto.

## Levantar en desarrollo

```bash
pnpm run dev
```

Luego abre la URL que muestra Vite en la terminal.

## Build

```bash
pnpm run build
```
