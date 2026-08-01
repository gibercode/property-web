import type { LoaderFunctionArgs } from 'react-router'
import { useInmuebleStore } from '../store/inmueble-store'
import type { InmueblesFilters, InmueblesLoaderData } from '../types/inmuebles'
import { requireAuthToken } from '../utils/auth-utils'

const getInmueblesFilters = (
  searchParams: URLSearchParams,
): InmueblesFilters => ({
  estado: searchParams.get('estado') ?? '',
  limit: searchParams.get('limit') ?? '10',
  order: searchParams.get('order') === 'ASC' ? 'ASC' : 'DESC',
  orderBy: searchParams.get('orderBy') === 'precio' ? 'precio' : 'createdAt',
  page: searchParams.get('page') ?? '1',
  precioMax: searchParams.get('precioMax') ?? '',
  precioMin: searchParams.get('precioMin') ?? '',
  search: searchParams.get('search') ?? '',
  soloMios: searchParams.get('soloMios') ?? 'false',
  tipoInmuebleId: searchParams.get('tipoInmuebleId') ?? '',
})

export async function inmueblesLoader({
  request,
}: LoaderFunctionArgs): Promise<InmueblesLoaderData> {
  const accessToken = requireAuthToken()
  const url = new URL(request.url)
  const filters = getInmueblesFilters(url.searchParams)
  const inmuebleStore = useInmuebleStore.getState()
  const [inmuebles, tiposInmueble] = await Promise.all([
    inmuebleStore.getInmuebles(filters, accessToken),
    inmuebleStore.getTiposInmueble(accessToken),
  ])

  return {
    filters,
    inmuebles,
    tiposInmueble,
  }
}
