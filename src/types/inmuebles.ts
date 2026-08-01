import type { PaginatedResponse } from './api'
import type { UserListItem } from './users'

export type InmuebleEstado = 'DISPONIBLE' | 'RESERVADO' | 'VENDIDO'

export type TipoInmueble = {
  id: string
  codigo: string
  nombre: string
  activo: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type Inmueble = {
  id: string
  direccion: string
  precio: number
  habitaciones: number
  metrosCuadrados: number
  estado: InmuebleEstado
  vendedorId: string
  vendedor?: UserListItem
  tipoInmuebleId: string
  tipoInmueble?: TipoInmueble
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type InmueblePayload = {
  direccion: string
  precio: number
  habitaciones: number
  metrosCuadrados: number
  tipoInmuebleId: string
}

export type InmuebleFormValues = {
  direccion: string
  precio: number
  habitaciones: number
  metrosCuadrados: number
  tipoInmuebleId: string
}

export type InmueblesFilters = {
  page: string
  limit: string
  estado: string
  tipoInmuebleId: string
  precioMin: string
  precioMax: string
  search: string
  soloMios: string
  orderBy: 'precio' | 'createdAt'
  order: 'ASC' | 'DESC'
}

export type InmueblesLoaderData = {
  filters: InmueblesFilters
  inmuebles: PaginatedResponse<Inmueble>
  tiposInmueble: TipoInmueble[]
}

export type AddInmuebleLoaderData = {
  tiposInmueble: TipoInmueble[]
}

export type InmuebleDetailLoaderData = {
  inmueble: Inmueble
}

export type EditInmuebleLoaderData = {
  inmueble: Inmueble
  tiposInmueble: TipoInmueble[]
}
