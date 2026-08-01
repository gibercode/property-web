import type { LoaderFunctionArgs } from 'react-router'
import { useInmuebleStore } from '../store/inmueble-store'
import type {
  EditInmuebleLoaderData,
  InmuebleDetailLoaderData,
} from '../types/inmuebles'
import { requireAuthToken } from '../utils/auth-utils'

export async function inmuebleDetailLoader({
  params,
}: LoaderFunctionArgs): Promise<InmuebleDetailLoaderData> {
  const accessToken = requireAuthToken()

  if (!params.id) {
    throw new Error('Inmueble no especificado')
  }

  const inmueble = await useInmuebleStore
    .getState()
    .getInmueble(params.id, accessToken)

  return {
    inmueble,
  }
}

export async function editInmuebleLoader({
  params,
}: LoaderFunctionArgs): Promise<EditInmuebleLoaderData> {
  const accessToken = requireAuthToken()

  if (!params.id) {
    throw new Error('Inmueble no especificado')
  }

  const inmuebleStore = useInmuebleStore.getState()
  const [inmueble, tiposInmueble] = await Promise.all([
    inmuebleStore.getInmueble(params.id, accessToken),
    inmuebleStore.getTiposInmueble(accessToken),
  ])

  return {
    inmueble,
    tiposInmueble,
  }
}
