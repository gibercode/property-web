import { Building2, UsersRound } from 'lucide-react'
import { Link } from 'react-router'
import { PageShell } from '../components/ui/PageShell'
import { useAuthStore } from '../store/auth-store'

export function AppHomePage() {
  const user = useAuthStore((state) => state.user)

  return (
    <PageShell
      description="Administra usuarios e inmuebles desde vistas conectadas al servidor."
      eyebrow={user ? user.email : 'Panel'}
      title="INMO"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          className="rounded-xl border border-line bg-white p-5 shadow-[0_18px_50px_rgba(24,24,27,0.06)]"
          to="/app/usuarios"
        >
          <span className="grid size-11 place-items-center rounded-lg bg-paper text-ink">
            <UsersRound aria-hidden="true" size={20} />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ash">
            Directorio
          </p>
          <h2 className="mt-3 text-2xl font-bold text-ink">Usuarios</h2>
          <p className="mt-2 text-sm text-ash">
            Busca usuarios por nombre, ordena por campos soportados y navega la
            paginacion del servidor.
          </p>
        </Link>
        <Link
          className="rounded-xl border border-line bg-white p-5 shadow-[0_18px_50px_rgba(24,24,27,0.06)]"
          to="/app/inmuebles"
        >
          <span className="grid size-11 place-items-center rounded-lg bg-paper text-ink">
            <Building2 aria-hidden="true" size={20} />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ash">
            Inventario
          </p>
          <h2 className="mt-3 text-2xl font-bold text-ink">Inmuebles</h2>
          <p className="mt-2 text-sm text-ash">
            Filtra por estado, tipo, precio, direccion y propiedades propias
            consultando siempre property-api.
          </p>
        </Link>
      </div>
    </PageShell>
  )
}
