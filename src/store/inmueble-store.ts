import { create } from 'zustand'
import type { ApiResponse, PaginatedResponse } from '../types/api'
import type {
  Inmueble,
  InmueblesFilters,
  InmuebleEstado,
  InmueblePayload,
  TipoInmueble,
} from '../types/inmuebles'
import { fetchService } from '../utils/fetch-service'

type InmuebleStoreState = {
  createInmueble: (
    payload: InmueblePayload,
    accessToken: string,
  ) => Promise<Inmueble>
  deleteInmueble: (id: string, accessToken: string) => Promise<boolean>
  getInmuebles: (
    filters: InmueblesFilters,
    accessToken: string,
  ) => Promise<PaginatedResponse<Inmueble>>
  getInmueble: (id: string, accessToken: string) => Promise<Inmueble>
  getTiposInmueble: (accessToken: string) => Promise<TipoInmueble[]>
  updateInmueble: (
    id: string,
    payload: Partial<InmueblePayload>,
    accessToken: string,
  ) => Promise<Inmueble>
  updateInmuebleEstado: (
    id: string,
    estado: InmuebleEstado,
    accessToken: string,
  ) => Promise<Inmueble>
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
  createInmueble: async (payload, accessToken) => {
    const { response } = await fetchService.request<ApiResponse<Inmueble>>(
      '/inmuebles',
      {
        data: payload,
        method: 'POST',
        token: accessToken,
      },
    )

    return response
  },
  deleteInmueble: async (id, accessToken) => {
    const { response } = await fetchService.request<ApiResponse<boolean>>(
      `/inmuebles/${id}`,
      {
        method: 'DELETE',
        token: accessToken,
      },
    )

    return response
  },
  getInmuebles: async (filters, accessToken) => {
    const searchParams = buildInmueblesSearchParams(filters)
    const { response } = await fetchService.request<
      ApiResponse<PaginatedResponse<Inmueble>>
    >(`/inmuebles?${searchParams.toString()}`, {
      token: accessToken,
    })

    return response
  },
  getInmueble: async (id, accessToken) => {
    const { response } = await fetchService.request<ApiResponse<Inmueble>>(
      `/inmuebles/${id}`,
      {
        token: accessToken,
      },
    )

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
  updateInmueble: async (id, payload, accessToken) => {
    const { response } = await fetchService.request<ApiResponse<Inmueble>>(
      `/inmuebles/${id}`,
      {
        data: payload,
        method: 'PATCH',
        token: accessToken,
      },
    )

    return response
  },
  updateInmuebleEstado: async (id, estado, accessToken) => {
    const { response } = await fetchService.request<ApiResponse<Inmueble>>(
      `/inmuebles/${id}/estado`,
      {
        data: { estado },
        method: 'PATCH',
        token: accessToken,
      },
    )

    return response
  },
}))
