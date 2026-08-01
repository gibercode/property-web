import type { PaginatedResponse } from './api'

export type UserListItem = {
  id: string
  nombre: string
  email: string
  activo: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type UsersFilters = {
  page: string
  limit: string
  search: string
  orderBy: 'nombre' | 'email' | 'activo'
  order: 'ASC' | 'DESC'
}

export type UsersLoaderData = {
  filters: UsersFilters
  users: PaginatedResponse<UserListItem>
}
