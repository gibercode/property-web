import { useState } from 'react'
import { useLoaderData, useNavigate, useSearchParams } from 'react-router'
import { InmuebleForm } from '../components/inmuebles/InmuebleForm'
import { BackButton } from '../components/ui/BackButton'
import { Notice } from '../components/ui/Notice'
import { PageShell } from '../components/ui/PageShell'
import { Select } from '../components/ui/Select'
import { useAuthStore } from '../store/auth-store'
import { useInmuebleStore } from '../store/inmueble-store'
import type {
  EditInmuebleLoaderData,
  InmuebleEstado,
  InmueblePayload,
} from '../types/inmuebles'
import { requireAuthToken } from '../utils/auth-utils'
import { ApiError } from '../utils/fetch-service'

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

export function EditInmueblePage() {
  const { inmueble, tiposInmueble } = useLoaderData() as EditInmuebleLoaderData
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentUserEmail = useAuthStore((state) => state.user?.email)
  const updateInmueble = useInmuebleStore((state) => state.updateInmueble)
  const updateInmuebleEstado = useInmuebleStore(
    (state) => state.updateInmuebleEstado,
  )
  const [error, setError] = useState('')
  const [estado, setEstado] = useState<InmuebleEstado>(inmueble.estado)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isOwn = inmueble.vendedor?.email === currentUserEmail
  const canEdit = isOwn && inmueble.estado !== 'VENDIDO'
  const estadoOptions = [inmueble.estado, ...statusTransitions[inmueble.estado]]
  const returnTo =
    searchParams.get('from') === 'list'
      ? '/app/inmuebles'
      : `/app/inmuebles/${inmueble.id}`
  const returnLabel =
    searchParams.get('from') === 'list'
      ? 'Volver al inventario'
      : 'Volver al detalle'

  const onSubmit = async (payload: InmueblePayload) => {
    setError('')
    setIsSubmitting(true)

    try {
      await updateInmueble(inmueble.id, payload, requireAuthToken())
      if (estado !== inmueble.estado) {
        await updateInmuebleEstado(inmueble.id, estado, requireAuthToken())
      }
      await navigate(returnTo)
    } catch (submitError) {
      setError(
        submitError instanceof ApiError
          ? submitError.message
          : 'No se pudo actualizar el inmueble.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageShell
      description="Solo puedes editar inmuebles propios que no esten vendidos."
      eyebrow="Editar inmueble"
      title={inmueble.direccion}
    >
      <BackButton label={returnLabel} to={returnTo} />
      {!canEdit ? (
        <Notice title="Edicion no disponible" variant="error">
          Este inmueble no puede editarse desde tu usuario.
        </Notice>
      ) : null}
      {error ? (
        <Notice title="No se pudo actualizar" variant="error">
          {error}
        </Notice>
      ) : null}
      {canEdit ? (
        <div className="grid gap-4">
          <div className="rounded-2xl border border-line bg-white/95 p-5 shadow-[0_18px_55px_rgba(17,24,39,0.06)]">
            <Select
              label="Estado"
              onChange={(event) =>
                setEstado(event.currentTarget.value as InmuebleEstado)
              }
              options={[
                ...estadoOptions.map((option) => ({
                  label: statusLabels[option],
                  value: option,
                })),
              ]}
              value={estado}
            />
            <p className="mt-2 text-sm text-ash">
              El servidor validara las transiciones permitidas para este estado.
            </p>
          </div>
          <InmuebleForm
            defaultValues={inmueble}
            isSubmitting={isSubmitting}
            onCancel={() => void navigate(returnTo)}
            onSubmit={onSubmit}
            submitLabel="Guardar cambios"
            tiposInmueble={tiposInmueble}
          />
        </div>
      ) : null}
    </PageShell>
  )
}
