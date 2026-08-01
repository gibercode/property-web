import { create } from 'zustand'
import type { ApiResponse, PaginatedResponse } from '../types/api'
import type { UserDetail, UserListItem, UsersFilters } from '../types/users'
import { fetchService } from '../utils/fetch-service'

type UserStoreState = {
  getUser: (id: string, accessToken: string) => Promise<UserDetail>
  getUsers: (
    filters: UsersFilters,
    accessToken: string,
  ) => Promise<PaginatedResponse<UserListItem>>
}

const buildUsersSearchParams = (filters: UsersFilters) => {
  const params = new URLSearchParams()

  params.set('page', filters.page)
  params.set('limit', filters.limit)
  params.set('orderBy', filters.orderBy)
  params.set('order', filters.order)

  if (filters.search) {
    params.set('search', filters.search)
  }

  return params
}

export const useUserStore = create<UserStoreState>()(() => ({
  getUser: async (id, accessToken) => {
    const { response } = await fetchService.request<ApiResponse<UserDetail>>(
      `/usuarios/${id}`,
      {
        token: accessToken,
      },
    )

    return response
  },
  getUsers: async (filters, accessToken) => {
    const searchParams = buildUsersSearchParams(filters)
    const { response } = await fetchService.request<
      ApiResponse<PaginatedResponse<UserListItem>>
    >(`/usuarios?${searchParams.toString()}`, {
      token: accessToken,
    })

    return response
  },
}))
