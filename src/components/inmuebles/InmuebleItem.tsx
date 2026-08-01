import type { Inmueble, InmuebleEstado } from '../../types/inmuebles'

type InmuebleItemProps = {
  inmueble: Inmueble
}

const statusClasses: Record<InmuebleEstado, string> = {
  DISPONIBLE: 'border-zinc-900 bg-zinc-900 text-white',
  RESERVADO: 'border-zinc-400 bg-zinc-100 text-zinc-800',
  VENDIDO: 'border-zinc-300 bg-white text-zinc-500',
}

const statusLabels: Record<InmuebleEstado, string> = {
  DISPONIBLE: 'Disponible',
  RESERVADO: 'Reservado',
  VENDIDO: 'Vendido',
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-VE', {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)

export function InmuebleItem({ inmueble }: InmuebleItemProps) {
  return (
    <li className="grid gap-3 border-b border-line px-4 py-4 last:border-b-0 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto] lg:items-center">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`size-2.5 rounded-full ${
              inmueble.estado === 'DISPONIBLE'
                ? 'bg-zinc-900'
                : inmueble.estado === 'RESERVADO'
                  ? 'bg-zinc-500'
                  : 'bg-zinc-300'
            }`}
          />
          <p className="truncate font-semibold text-ink">{inmueble.direccion}</p>
        </div>
        <p className="mt-1 text-sm text-ash">
          {inmueble.tipoInmueble?.nombre ?? 'Sin tipo'} ·{' '}
          {inmueble.habitaciones} hab · {inmueble.metrosCuadrados} m2
        </p>
      </div>
      <p className="font-semibold text-ink">{formatCurrency(inmueble.precio)}</p>
      <p className="text-sm text-ash">
        {inmueble.vendedor?.nombre ?? 'Sin vendedor'}
      </p>
      <span
        className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[inmueble.estado]}`}
      >
        {statusLabels[inmueble.estado]}
      </span>
    </li>
  )
}
