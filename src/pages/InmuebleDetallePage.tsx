import { CircleDot, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  Link,
  useLoaderData,
  useNavigate,
  useRevalidator,
} from 'react-router'
import { BackButton } from '../components/ui/BackButton'
import { Button } from '../components/ui/Button'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { Notice } from '../components/ui/Notice'
import { PageShell } from '../components/ui/PageShell'
import { useDisclosure } from '../hooks/useDisclosure'
import { useAuthStore } from '../store/auth-store'
import { useInmuebleStore } from '../store/inmueble-store'
import type {
  InmuebleDetailLoaderData,
  InmuebleEstado,
} from '../types/inmuebles'
import { requireAuthToken } from '../utils/auth-utils'
import { ApiError } from '../utils/fetch-service'

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

const statusTransitions: Record<InmuebleEstado, InmuebleEstado[]> = {
  DISPONIBLE: ['RESERVADO'],
  RESERVADO: ['DISPONIBLE', 'VENDIDO'],
  VENDIDO: [],
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-VE', {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)

export function InmuebleDetallePage() {
  const { inmueble } = useLoaderData() as InmuebleDetailLoaderData
  const navigate = useNavigate()
  const revalidator = useRevalidator()
  const currentUserEmail = useAuthStore((state) => state.user?.email)
  const deleteInmueble = useInmuebleStore((state) => state.deleteInmueble)
  const updateInmuebleEstado = useInmuebleStore(
    (state) => state.updateInmuebleEstado,
  )
  const [actionError, setActionError] = useState('')
  const deleteDisclosure = useDisclosure()
  const isOwn = inmueble.vendedor?.email === currentUserEmail
  const canEdit = isOwn && inmueble.estado !== 'VENDIDO'
  const nextEstados = isOwn ? statusTransitions[inmueble.estado] : []

  const onDelete = async () => {
    setActionError('')

    try {
      await deleteInmueble(inmueble.id, requireAuthToken())
      deleteDisclosure.close()
      await navigate('/app/inmuebles')
    } catch (error) {
      setActionError(
        error instanceof ApiError
          ? error.message
          : 'No se pudo eliminar el inmueble.',
      )
    }
  }

  const onEstadoChange = async (estado: InmuebleEstado) => {
    setActionError('')

    try {
      await updateInmuebleEstado(inmueble.id, estado, requireAuthToken())
      await revalidator.revalidate()
    } catch (error) {
      setActionError(
        error instanceof ApiError
          ? error.message
          : 'No se pudo actualizar el estado.',
      )
    }
  }

  return (
    <PageShell
      description="Detalle consultado desde property-api."
      eyebrow={inmueble.tipoInmueble?.nombre ?? 'Inmueble'}
      title={inmueble.direccion}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BackButton label="Volver al inventario" to="/app/inmuebles" />
        {canEdit ? (
          <Link to={`/app/inmuebles/${inmueble.id}/editar?from=detail`}>
            <Button className="min-h-9 px-3" variant="secondary">
              <Pencil aria-hidden="true" size={16} />
              Editar inmueble
            </Button>
          </Link>
        ) : null}
      </div>

      {actionError ? (
        <Notice title="Accion no disponible" variant="error">
          {actionError}
        </Notice>
      ) : null}

      <section className="grid gap-4 rounded-2xl border border-line bg-white/95 p-5 shadow-[0_18px_55px_rgba(17,24,39,0.06)] md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[inmueble.estado]}`}
          >
            {statusLabels[inmueble.estado]}
          </span>
          <dl className="mt-5 grid gap-3 text-sm">
            <div className="grid gap-1 rounded-xl border border-line bg-porcelain/70 p-4">
              <dt className="font-semibold text-ash">Precio</dt>
              <dd className="text-lg font-bold text-ink">
                {formatCurrency(inmueble.precio)}
              </dd>
            </div>
            <div className="grid gap-1 border-b border-line pb-3">
              <dt className="font-semibold text-ash">Habitaciones</dt>
              <dd className="text-ink">{inmueble.habitaciones}</dd>
            </div>
            <div className="grid gap-1 border-b border-line pb-3">
              <dt className="font-semibold text-ash">Metros cuadrados</dt>
              <dd className="text-ink">{inmueble.metrosCuadrados} m2</dd>
            </div>
            <div className="grid gap-1">
              <dt className="font-semibold text-ash">Tipo</dt>
              <dd className="text-ink">
                {inmueble.tipoInmueble?.nombre ?? 'Sin tipo'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-line bg-porcelain p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-ink">Vendedor</p>
            {isOwn ? (
              <span className="rounded-full border border-line bg-white px-2 py-1 text-xs text-ash">
                Propio
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-ash">
            {inmueble.vendedor?.nombre ?? 'Sin vendedor'}
          </p>
          <p className="mt-1 break-all text-sm text-ash">
            {inmueble.vendedor?.email ?? 'Sin email'}
          </p>
        </div>
      </section>

      {isOwn ? (
        <section className="rounded-2xl border border-line bg-white/95 p-5 shadow-[0_18px_55px_rgba(17,24,39,0.06)]">
          <div className="grid gap-1">
            <h2 className="text-base font-bold text-ink">Gestion del inmueble</h2>
            <p className="text-sm text-ash">
              Cambia el estado desde las transiciones permitidas o elimina el
              registro si ya no debe aparecer en el inventario.
            </p>
          </div>

          <div className="mt-4 divide-y divide-line rounded-xl border border-line">
            {nextEstados.length > 0 ? (
              nextEstados.map((estado) => (
                <div
                  className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  key={estado}
                >
                  <div className="flex items-start gap-3">
                    <CircleDot
                      aria-hidden="true"
                      className="mt-0.5 text-ash"
                      size={18}
                    />
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        Marcar como {statusLabels[estado].toLowerCase()}
                      </p>
                      <p className="text-sm text-ash">
                        Actualiza el estado visible del inmueble.
                      </p>
                    </div>
                  </div>
                  <Button
                    className="min-h-9 px-3"
                    onClick={() => void onEstadoChange(estado)}
                    type="button"
                    variant="secondary"
                  >
                    Aplicar
                  </Button>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-ash">
                No hay cambios de estado disponibles.
              </div>
            )}
            <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Trash2 aria-hidden="true" className="mt-0.5 text-coral" size={18} />
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Eliminar inmueble
                  </p>
                  <p className="text-sm text-ash">
                    Retira este inmueble del inventario.
                  </p>
                </div>
              </div>
              <Button
                className="min-h-9 px-3"
                onClick={deleteDisclosure.open}
                type="button"
                variant="danger"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      <ConfirmModal
        confirmLabel="Eliminar"
        isOpen={deleteDisclosure.isOpen}
        onClose={deleteDisclosure.close}
        onConfirm={() => void onDelete()}
        title="Eliminar inmueble"
      >
        Esta accion retirara este inmueble del inventario. Para continuar,
        confirma la eliminacion.
      </ConfirmModal>
    </PageShell>
  )
}
