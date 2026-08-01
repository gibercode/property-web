import { Eye, Pencil, UserMinus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDisclosure } from '../../hooks/useDisclosure'
import type { UpdateMePayload, User } from '../../types/auth'
import type { UserListItem } from '../../types/users'
import { Button } from '../ui/Button'
import { ConfirmModal } from '../ui/ConfirmModal'
import { Input } from '../ui/Input'
import { Spinner } from '../ui/Spinner'

type UserItemProps = {
  isCurrentUser: boolean
  onDeactivateMe: () => Promise<void>
  onUpdateMe: (payload: UpdateMePayload) => Promise<void>
  onViewMe: () => Promise<User | null>
  user: UserListItem
}

export function UserItem({
  isCurrentUser,
  onDeactivateMe,
  onUpdateMe,
  onViewMe,
  user,
}: UserItemProps) {
  const editDisclosure = useDisclosure()
  const deactivateDisclosure = useDisclosure()
  const detailsDisclosure = useDisclosure()
  const [details, setDetails] = useState<User | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<UpdateMePayload>({
    defaultValues: {
      email: user.email,
      nombre: user.nombre,
    },
  })

  const onSubmit = async (payload: UpdateMePayload) => {
    await onUpdateMe(payload)
    editDisclosure.close()
  }

  const onConfirmDeactivate = async () => {
    await onDeactivateMe()
    deactivateDisclosure.close()
  }

  const onOpenDetails = async () => {
    setIsLoadingDetails(true)

    try {
      const userDetails = await onViewMe()
      setDetails(userDetails)
      detailsDisclosure.open()
    } finally {
      setIsLoadingDetails(false)
    }
  }

  return (
    <li className="border-b border-line px-4 py-3 last:border-b-0">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(220px,1.1fr)_340px] md:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-ink">{user.nombre}</p>
            {isCurrentUser ? (
              <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-paper">
                Tu cuenta
              </span>
            ) : null}
          </div>
          <p className="text-xs text-ash">Usuario registrado</p>
        </div>
        <p className="min-w-0 truncate text-sm text-ash">{user.email}</p>
        <div className="grid grid-cols-[1fr_72px] items-center gap-2 md:min-h-9">
          {isCurrentUser ? (
            <div className="flex justify-start gap-2 md:justify-end">
              <Button
                className="min-h-9 px-3"
                disabled={isLoadingDetails}
                onClick={() => void onOpenDetails()}
                type="button"
                variant="secondary"
              >
                {isLoadingDetails ? (
                  <Spinner label="Cargando usuario" size="sm" />
                ) : (
                  <Eye aria-hidden="true" size={15} />
                )}
                Ver
              </Button>
              <Button
                className="min-h-9 px-3"
                onClick={editDisclosure.toggle}
                type="button"
                variant="secondary"
              >
                <Pencil aria-hidden="true" size={15} />
                Editar
              </Button>
              <Button
                className="min-h-9 px-3"
                onClick={deactivateDisclosure.open}
                type="button"
                variant="danger"
              >
                <UserMinus aria-hidden="true" size={15} />
                Baja
              </Button>
            </div>
          ) : (
            <span aria-hidden="true" />
          )}
          <span
            className={`w-fit justify-self-end rounded-full px-2.5 py-1 text-xs font-semibold ${
              user.activo ? 'bg-porcelain text-ink' : 'bg-line text-ash'
            }`}
          >
            {user.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      {isCurrentUser && editDisclosure.isOpen ? (
        <form
          className="mt-4 grid gap-3 rounded-lg border border-line bg-paper p-3 sm:grid-cols-[1fr_1fr_auto]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            error={errors.nombre?.message}
            label="Nombre"
            {...register('nombre', {
              maxLength: {
                message: 'Maximo 150 caracteres.',
                value: 150,
              },
              minLength: {
                message: 'Minimo 2 caracteres.',
                value: 2,
              },
            })}
          />
          <Input
            error={errors.email?.message}
            label="Email"
            type="email"
            {...register('email', {
              maxLength: {
                message: 'Maximo 255 caracteres.',
                value: 255,
              },
              pattern: {
                message: 'Ingresa un email valido.',
                value: /^\S+@\S+\.\S+$/,
              },
            })}
          />
          <div className="flex gap-2 self-end">
            <Button disabled={isSubmitting} type="submit">
              Guardar
            </Button>
            <Button
              onClick={editDisclosure.close}
              type="button"
              variant="secondary"
            >
              Cancelar
            </Button>
          </div>
        </form>
      ) : null}

      <ConfirmModal
        confirmLabel="Dar de baja"
        isOpen={deactivateDisclosure.isOpen}
        onClose={deactivateDisclosure.close}
        onConfirm={() => void onConfirmDeactivate()}
        title="Dar de baja tu cuenta"
      >
        Esta accion desactiva tu cuenta y cerrara tu sesion. Para continuar,
        confirma la baja.
      </ConfirmModal>

      {detailsDisclosure.isOpen && details ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-ink/45 px-4"
          role="dialog"
        >
          <div className="w-full max-w-lg rounded-xl border border-line bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-ink">Detalle de usuario</h2>
                <p className="mt-1 text-sm text-ash">
                  Informacion actual de tu cuenta.
                </p>
              </div>
              <Button onClick={detailsDisclosure.close} variant="secondary">
                Cerrar
              </Button>
            </div>

            <dl className="mt-5 divide-y divide-line rounded-lg border border-line text-sm">
              <div className="grid gap-1 px-4 py-3">
                <dt className="font-semibold text-ash">Nombre</dt>
                <dd className="text-ink">{details.nombre}</dd>
              </div>
              <div className="grid gap-1 px-4 py-3">
                <dt className="font-semibold text-ash">Email</dt>
                <dd className="break-all text-ink">{details.email}</dd>
              </div>
              <div className="grid gap-1 px-4 py-3">
                <dt className="font-semibold text-ash">Estado</dt>
                <dd className="text-ink">{details.activo ? 'Activo' : 'Inactivo'}</dd>
              </div>
              <div className="grid gap-1 px-4 py-3">
                <dt className="font-semibold text-ash">Creado</dt>
                <dd className="text-ink">
                  {new Date(details.createdAt).toLocaleString('es-VE')}
                </dd>
              </div>
              <div className="grid gap-1 px-4 py-3">
                <dt className="font-semibold text-ash">Actualizado</dt>
                <dd className="text-ink">
                  {new Date(details.updatedAt).toLocaleString('es-VE')}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      ) : null}
    </li>
  )
}
