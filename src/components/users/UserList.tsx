import type { UpdateMePayload, User } from '../../types/auth'
import type { UserDetail, UserListItem } from '../../types/users'
import { Notice } from '../ui/Notice'
import { UserItem } from './UserItem'

type UserListProps = {
  currentUserEmail?: string
  onDeactivateMe: () => Promise<void>
  onUpdateMe: (payload: UpdateMePayload) => Promise<void>
  onViewMe: () => Promise<User | null>
  onViewUser: (id: string) => Promise<UserDetail>
  users: UserListItem[]
}

export function UserList({
  currentUserEmail,
  onDeactivateMe,
  onUpdateMe,
  onViewMe,
  onViewUser,
  users,
}: UserListProps) {
  if (users.length === 0) {
    return (
      <Notice title="Sin usuarios">
        No hay usuarios que coincidan con los filtros actuales.
      </Notice>
    )
  }

  return (
    <ul className="overflow-hidden rounded-2xl border border-line bg-white/95 shadow-[0_18px_55px_rgba(17,24,39,0.06)]">
      <li className="hidden border-b border-line bg-porcelain/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-ash lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(220px,1.1fr)_260px_86px]">
        <span>Usuario</span>
        <span>Email</span>
        <span className="text-right">Acciones</span>
        <span className="text-right">Estado</span>
      </li>
      {users.map((user) => (
        <UserItem
          key={user.id}
          isCurrentUser={user.email === currentUserEmail}
          onDeactivateMe={onDeactivateMe}
          onUpdateMe={onUpdateMe}
          onViewMe={onViewMe}
          onViewUser={onViewUser}
          user={user}
        />
      ))}
    </ul>
  )
}
