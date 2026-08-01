import { Eye, Pencil } from 'lucide-react'
import { Link } from 'react-router'
import type { Inmueble, InmuebleEstado } from '../../types/inmuebles'
import { Button } from '../ui/Button'

type InmuebleItemProps = {
  currentUserEmail?: string
  inmueble: Inmueble
}

const statusClasses: Record<InmuebleEstado, string> = {
  DISPONIBLE: 'border-ink bg-ink text-white',
  RESERVADO: 'border-lilac bg-white text-ink',
  VENDIDO: 'border-line bg-porcelain text-ash',
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

export function InmuebleItem({
  currentUserEmail,
  inmueble,
}: InmuebleItemProps) {
  const isOwn = inmueble.vendedor?.email === currentUserEmail
  const canEdit = isOwn && inmueble.estado !== 'VENDIDO'

  return (
    <li className="grid gap-3 border-b border-line bg-white px-4 py-4 last:border-b-0 xl:grid-cols-[minmax(0,1.7fr)_0.65fr_0.85fr_210px] xl:items-center">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`size-2.5 rounded-full ${
              inmueble.estado === 'DISPONIBLE'
                ? 'bg-ink'
                : inmueble.estado === 'RESERVADO'
                  ? 'bg-lilac'
                  : 'bg-line'
            }`}
          />
          <p className="truncate font-semibold text-ink">{inmueble.direccion}</p>
        </div>
        <p className="mt-1 text-sm text-ash">
          {inmueble.tipoInmueble?.nombre ?? 'Sin tipo'} · {inmueble.habitaciones}{' '}
          hab · {inmueble.metrosCuadrados} m2
        </p>
      </div>
      <p className="font-semibold text-ink">{formatCurrency(inmueble.precio)}</p>
      <p className="truncate text-sm text-ash">
        {inmueble.vendedor?.nombre ?? 'Sin vendedor'}
      </p>
      <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex flex-wrap gap-2 md:justify-end">
          <Link to={`/app/inmuebles/${inmueble.id}`}>
            <Button className="min-h-9 px-3" variant="secondary">
              <Eye aria-hidden="true" size={15} />
              Ver
            </Button>
          </Link>
          {canEdit ? (
            <Link to={`/app/inmuebles/${inmueble.id}/editar?from=list`}>
              <Button className="min-h-9 px-3" variant="secondary">
                <Pencil aria-hidden="true" size={15} />
                Editar
              </Button>
            </Link>
          ) : null}
        </div>
        <span
          className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold md:justify-self-end ${statusClasses[inmueble.estado]}`}
        >
          {statusLabels[inmueble.estado]}
        </span>
      </div>
    </li>
  )
}
