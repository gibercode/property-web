import type { PaginationMeta } from '../../types/api'
import { Button } from './Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  meta: PaginationMeta
  onPageChange: (page: number) => void
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const hasPrevious = meta.page > 1
  const hasNext = meta.page < meta.totalPages

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-ink">
          {meta.total} resultados
        </p>
        <p className="text-xs text-ash">
          Pagina {meta.page} de {Math.max(meta.totalPages, 1)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="min-w-11 px-3"
          disabled={!hasPrevious}
          onClick={() => onPageChange(meta.page - 1)}
          type="button"
          variant="secondary"
        >
          <ChevronLeft aria-hidden="true" size={16} />
          <span className="hidden sm:inline">Anterior</span>
        </Button>
        <span className="grid min-h-11 min-w-11 place-items-center rounded-md bg-paper px-3 text-sm font-semibold text-ink">
          {meta.page}
        </span>
        <Button
          className="min-w-11 px-3"
          disabled={!hasNext}
          onClick={() => onPageChange(meta.page + 1)}
          type="button"
          variant="secondary"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight aria-hidden="true" size={16} />
        </Button>
      </div>
    </div>
  )
}
