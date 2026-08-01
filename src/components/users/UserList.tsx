import type { UpdateMePayload, User } from '../../types/auth'
import type { UserListItem } from '../../types/users'
import { Notice } from '../ui/Notice'
import { UserItem } from './UserItem'

type UserListProps = {
  currentUserEmail?: string
  onDeactivateMe: () => Promise<void>
  onUpdateMe: (payload: UpdateMePayload) => Promise<void>
  onViewMe: () => Promise<User | null>
  users: UserListItem[]
}

export function UserList({
  currentUserEmail,
  onDeactivateMe,
  onUpdateMe,
  onViewMe,
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
    <ul className="overflow-hidden rounded-lg border border-line bg-white">
      {users.map((user) => (
        <UserItem
          key={user.id}
          isCurrentUser={user.email === currentUserEmail}
          onDeactivateMe={onDeactivateMe}
          onUpdateMe={onUpdateMe}
          onViewMe={onViewMe}
          user={user}
        />
      ))}
    </ul>
  )
}
