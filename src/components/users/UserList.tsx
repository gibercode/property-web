import type { UserListItem } from '../../types/users'
import { Notice } from '../ui/Notice'
import { UserItem } from './UserItem'

type UserListProps = {
  users: UserListItem[]
}

export function UserList({ users }: UserListProps) {
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
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  )
}
