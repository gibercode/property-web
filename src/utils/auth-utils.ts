import { redirect } from 'react-router'
import { useAuthStore } from '../store/auth-store'

export const requireAuthToken = () => {
  const token = useAuthStore.getState().accessToken

  if (!token) {
    throw redirect('/login')
  }

  return token
}
