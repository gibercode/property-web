import type { Inmueble } from '../../types/inmuebles'
import { Notice } from '../ui/Notice'
import { InmuebleItem } from './InmuebleItem'

type InmuebleListProps = {
  inmuebles: Inmueble[]
}

export function InmuebleList({ inmuebles }: InmuebleListProps) {
  if (inmuebles.length === 0) {
    return (
      <Notice title="Sin inmuebles">
        No hay inmuebles que coincidan con los filtros actuales.
      </Notice>
    )
  }

  return (
    <ul className="overflow-hidden rounded-lg border border-line bg-white">
      {inmuebles.map((inmueble) => (
        <InmuebleItem key={inmueble.id} inmueble={inmueble} />
      ))}
    </ul>
  )
}
