import type { UserListItem } from '../../types/users'

type UserItemProps = {
  user: UserListItem
}

export function UserItem({ user }: UserItemProps) {
  return (
    <li className="grid gap-3 border-b border-line px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_1.2fr_auto] sm:items-center">
      <div>
        <p className="font-semibold text-ink">{user.nombre}</p>
        <p className="text-xs text-ash">Usuario registrado</p>
      </div>
      <p className="text-sm text-ash">{user.email}</p>
      <span
        className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
          user.activo ? 'bg-porcelain text-ink' : 'bg-line text-ash'
        }`}
      >
        {user.activo ? 'Activo' : 'Inactivo'}
      </span>
    </li>
  )
}
