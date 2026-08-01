import { createBrowserRouter, redirect } from 'react-router'
import App from './App'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { RouteErrorPage } from './pages/RouteErrorPage'

const indexLoader = () => {
  throw redirect('/login')
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
        element: <LoginPage />,
      },
      {
        path: 'registro',
        element: <RegisterPage />,
      },
    ],
  },
])
