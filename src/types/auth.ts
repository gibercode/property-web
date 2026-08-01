export type User = {
  nombre: string
  email: string
  activo: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type AuthUser = User & {
  accessToken: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  nombre: string
  email: string
  password: string
}

export type UpdateMePayload = {
  nombre?: string
  email?: string
}
