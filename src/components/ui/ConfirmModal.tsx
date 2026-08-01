import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

type ConfirmModalProps = {
  cancelLabel?: string
  children: ReactNode
  confirmLabel?: string
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}

export function ConfirmModal({
  cancelLabel = 'Cancelar',
  children,
  confirmLabel = 'Confirmar',
  isLoading = false,
  isOpen,
  onClose,
  onConfirm,
  title,
}: ConfirmModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-ink/45 px-4"
      role="dialog"
    >
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-5 shadow-[0_24px_70px_rgba(17,24,39,0.2)]">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-coral/10 text-coral">
            <AlertTriangle aria-hidden="true" size={20} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink">{title}</h2>
            <div className="mt-2 text-sm leading-6 text-ash">{children}</div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button disabled={isLoading} onClick={onClose} variant="secondary">
            {cancelLabel}
          </Button>
          <Button disabled={isLoading} onClick={onConfirm} variant="danger">
            {isLoading ? 'Procesando' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
