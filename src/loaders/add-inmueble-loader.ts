import { useInmuebleStore } from '../store/inmueble-store'
import type { AddInmuebleLoaderData } from '../types/inmuebles'
import { requireAuthToken } from '../utils/auth-utils'

export async function addInmuebleLoader(): Promise<AddInmuebleLoaderData> {
  const accessToken = requireAuthToken()
  const tiposInmueble =
    await useInmuebleStore.getState().getTiposInmueble(accessToken)

  return {
    tiposInmueble,
  }
}
