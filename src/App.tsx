import { Building2, Home, LogOut, UsersRound } from 'lucide-react'
import { NavLink, Outlet, useNavigate, useNavigation } from 'react-router'
import { Spinner } from './components/ui/Spinner'
import { useAuthStore } from './store/auth-store'

function App() {
  const navigate = useNavigate()
  const navigation = useNavigation()
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)

  const onLogout = () => {
    clearSession()
    void navigate('/login')
  }

  return (
    <div className="min-h-svh bg-paper text-ink">
      {accessToken ? (
        <header className="sticky top-0 z-40 border-b border-line/80 bg-white/85 backdrop-blur-xl">
          <div className="mx-auto flex min-h-16 w-[min(1180px,calc(100%-32px))] flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between gap-4">
              <NavLink className="flex items-center gap-2 font-bold" to="/app">
                <span className="grid size-9 place-items-center rounded-md bg-ink text-paper">
                  <Building2 aria-hidden="true" size={18} />
                </span>
                <span className="text-xl tracking-tight">INMO</span>
              </NavLink>
              <button
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink md:hidden"
                onClick={onLogout}
                type="button"
              >
                <LogOut aria-hidden="true" size={16} />
                Salir
              </button>
            </div>

            <nav
              aria-label="Navegacion de aplicacion"
              className="flex items-center gap-1 rounded-lg border border-line bg-paper p-1"
            >
              <NavLink
                className={({ isActive }) =>
                  `inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold md:flex-none ${
                    isActive ? 'bg-white text-ink shadow-sm' : 'text-ash'
                  }`
                }
                to="/app"
              >
                <Home aria-hidden="true" size={16} />
                Panel
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold md:flex-none ${
                    isActive ? 'bg-white text-ink shadow-sm' : 'text-ash'
                  }`
                }
                to="/app/usuarios"
              >
                <UsersRound aria-hidden="true" size={16} />
                Usuarios
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold md:flex-none ${
                    isActive ? 'bg-white text-ink shadow-sm' : 'text-ash'
                  }`
                }
                to="/app/inmuebles"
              >
                <Building2 aria-hidden="true" size={16} />
                Inmuebles
              </NavLink>
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <div className="text-right">
                <p className="text-sm font-semibold text-ink">
                  {user?.nombre ?? 'Usuario'}
                </p>
                <p className="text-xs text-ash">{user?.email ?? 'Sesion activa'}</p>
              </div>
              <button
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink"
                onClick={onLogout}
                type="button"
              >
                <LogOut aria-hidden="true" size={16} />
                Salir
              </button>
            </div>
          </div>
        </header>
      ) : null}

      {navigation.state === 'loading' ? (
        <div className="fixed right-4 top-4 z-50 rounded-full border border-line bg-white p-2 shadow-[0_12px_32px_rgba(24,24,27,0.12)]">
          <Spinner label="Cargando ruta" size="sm" />
        </div>
      ) : null}

      <Outlet />
    </div>
  )
}

export default App
