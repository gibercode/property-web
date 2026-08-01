import { create } from 'zustand'
import type { ApiResponse, PaginatedResponse } from '../types/api'
import type {
  Inmueble,
  InmueblesFilters,
  TipoInmueble,
} from '../types/inmuebles'
import { fetchService } from '../utils/fetch-service'

type InmuebleStoreState = {
  getInmuebles: (
    filters: InmueblesFilters,
    accessToken: string,
  ) => Promise<PaginatedResponse<Inmueble>>
  getTiposInmueble: (accessToken: string) => Promise<TipoInmueble[]>
}

const buildInmueblesSearchParams = (filters: InmueblesFilters) => {
  const params = new URLSearchParams()

  params.set('page', filters.page)
  params.set('limit', filters.limit)
  params.set('orderBy', filters.orderBy)
  params.set('order', filters.order)

  for (const key of [
    'estado',
    'tipoInmuebleId',
    'precioMin',
    'precioMax',
    'search',
    'soloMios',
  ] as const) {
    const value = filters[key]

    if (value && value !== 'false') {
      params.set(key, value)
    }
  }

  return params
}

export const useInmuebleStore = create<InmuebleStoreState>()(() => ({
  getInmuebles: async (filters, accessToken) => {
    const searchParams = buildInmueblesSearchParams(filters)
    const { response } = await fetchService.request<
      ApiResponse<PaginatedResponse<Inmueble>>
    >(`/inmuebles?${searchParams.toString()}`, {
      token: accessToken,
    })

    return response
  },
  getTiposInmueble: async (accessToken) => {
    const { response } = await fetchService.request<
      ApiResponse<TipoInmueble[]>
    >('/tipos-inmueble', {
      token: accessToken,
    })

    return response
  },
}))
