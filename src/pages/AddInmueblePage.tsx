import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import { InmuebleForm } from '../components/inmuebles/InmuebleForm'
import { BackButton } from '../components/ui/BackButton'
import { Notice } from '../components/ui/Notice'
import { PageShell } from '../components/ui/PageShell'
import { useAuthStore } from '../store/auth-store'
import { useInmuebleStore } from '../store/inmueble-store'
import type {
  AddInmuebleLoaderData,
  InmueblePayload,
} from '../types/inmuebles'
import { requireAuthToken } from '../utils/auth-utils'
import { ApiError } from '../utils/fetch-service'

export function AddInmueblePage() {
  const { tiposInmueble } = useLoaderData() as AddInmuebleLoaderData
  const navigate = useNavigate()
  const createInmueble = useInmuebleStore((state) => state.createInmueble)
  const user = useAuthStore((state) => state.user)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (payload: InmueblePayload) => {
    setError('')
    setIsSubmitting(true)

    try {
      const inmueble = await createInmueble(payload, requireAuthToken())
      await navigate(`/app/inmuebles/${inmueble.id}`)
    } catch (submitError) {
      setError(
        submitError instanceof ApiError
          ? submitError.message
          : 'No se pudo crear el inmueble.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageShell
      description={`El inmueble quedara asociado a ${user?.email ?? 'tu usuario'} y se creara como disponible.`}
      eyebrow="Nuevo inmueble"
      title="Agregar inmueble"
    >
      <BackButton label="Volver al inventario" to="/app/inmuebles" />
      {error ? (
        <Notice title="No se pudo crear" variant="error">
          {error}
        </Notice>
      ) : null}
      <InmuebleForm
        isSubmitting={isSubmitting}
        onCancel={() => void navigate('/app/inmuebles')}
        onSubmit={onSubmit}
        submitLabel="Crear inmueble"
        tiposInmueble={tiposInmueble}
      />
    </PageShell>
  )
}
