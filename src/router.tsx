import { createBrowserRouter, redirect } from 'react-router'
import App from './App'
import { AppHomePage } from './pages/AppHomePage'
import { InmueblesPage } from './pages/InmueblesPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { RouteErrorPage } from './pages/RouteErrorPage'
import { UsersPage } from './pages/UsersPage'
import { inmueblesLoader } from './loaders/inmuebles-loader'
import { usersLoader } from './loaders/users-loader'
import { useAuthStore } from './store/auth-store'

const indexLoader = () => {
  throw redirect(useAuthStore.getState().accessToken ? '/app' : '/login')
}

const publicOnlyLoader = () => {
  if (useAuthStore.getState().accessToken) {
    throw redirect('/app')
  }

  return null
}

const protectedLoader = () => {
  if (!useAuthStore.getState().accessToken) {
    throw redirect('/login')
  }

  return null
}

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        loader: indexLoader,
      },
      {
        path: 'login',
        loader: publicOnlyLoader,
        element: <LoginPage />,
      },
      {
        path: 'registro',
        loader: publicOnlyLoader,
        element: <RegisterPage />,
      },
      {
        path: 'app',
        loader: protectedLoader,
        element: <AppHomePage />,
      },
      {
        path: 'app/usuarios',
        loader: usersLoader,
        element: <UsersPage />,
      },
      {
        path: 'app/inmuebles',
        loader: inmueblesLoader,
        element: <InmueblesPage />,
      },
    ],
  },
])
