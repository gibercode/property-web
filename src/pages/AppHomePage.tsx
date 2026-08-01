import { Building2, ChevronRight, UsersRound } from 'lucide-react'
import { Link } from 'react-router'
import { PageShell } from '../components/ui/PageShell'
import { useAuthStore } from '../store/auth-store'

export function AppHomePage() {
  const user = useAuthStore((state) => state.user)

  return (
    <PageShell
      eyebrow={user ? user.email : 'Panel'}
      title="INMO"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          className="group rounded-2xl border border-line bg-white/92 p-5 shadow-[0_18px_55px_rgba(17,24,39,0.07)]"
          to="/app/usuarios"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="grid size-11 place-items-center rounded-xl bg-porcelain text-ink">
              <UsersRound aria-hidden="true" size={20} />
            </span>
            <ChevronRight aria-hidden="true" className="text-ash" size={20} />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-ash">
            Directorio
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Usuarios</h2>
          <p className="mt-2 text-sm text-ash">
            Consulta perfiles, busca por nombre y gestiona solo tu propia cuenta.
          </p>
        </Link>
        <Link
          className="group rounded-2xl border border-line bg-white/92 p-5 shadow-[0_18px_55px_rgba(17,24,39,0.07)]"
          to="/app/inmuebles"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="grid size-11 place-items-center rounded-xl bg-ink text-white">
              <Building2 aria-hidden="true" size={20} />
            </span>
            <ChevronRight aria-hidden="true" className="text-ash" size={20} />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-ash">
            Inventario
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Inmuebles</h2>
          <p className="mt-2 text-sm text-ash">
            Filtra por estado, tipo, precio, direccion y propiedades propias.
          </p>
        </Link>
      </div>
    </PageShell>
  )
}
