import type { Inmueble } from '../../types/inmuebles'
import { Notice } from '../ui/Notice'
import { InmuebleItem } from './InmuebleItem'

type InmuebleListProps = {
  currentUserEmail?: string
  inmuebles: Inmueble[]
}

export function InmuebleList({
  currentUserEmail,
  inmuebles,
}: InmuebleListProps) {
  if (inmuebles.length === 0) {
    return (
      <Notice title="Sin inmuebles">
        No hay inmuebles que coincidan con los filtros actuales.
      </Notice>
    )
  }

  return (
    <ul className="overflow-hidden rounded-2xl border border-line bg-white/95 shadow-[0_18px_55px_rgba(17,24,39,0.06)]">
      <li className="hidden border-b border-line bg-porcelain/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-ash xl:grid xl:grid-cols-[minmax(0,1.7fr)_0.65fr_0.85fr_210px]">
        <span>Inmueble</span>
        <span>Precio</span>
        <span>Vendedor</span>
        <span className="text-right">Acciones</span>
      </li>
      {inmuebles.map((inmueble) => (
        <InmuebleItem
          key={inmueble.id}
          currentUserEmail={currentUserEmail}
          inmueble={inmueble}
        />
      ))}
    </ul>
  )
}
