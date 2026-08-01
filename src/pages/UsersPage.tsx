import { Search } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Link,
  useLoaderData,
  useNavigate,
  useNavigation,
  useRevalidator,
} from 'react-router'
import { UserList } from '../components/users/UserList'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Notice } from '../components/ui/Notice'
import { PageShell } from '../components/ui/PageShell'
import { Pagination } from '../components/ui/Pagination'
import { Select } from '../components/ui/Select'
import { Spinner } from '../components/ui/Spinner'
import { useAuthStore } from '../store/auth-store'
import { useUserStore } from '../store/user-store'
import type { UpdateMePayload } from '../types/auth'
import type { UsersFilters, UsersLoaderData } from '../types/users'
import { ApiError } from '../utils/fetch-service'

const orderByOptions = [
  { label: 'Nombre', value: 'nombre' },
  { label: 'Email', value: 'email' },
  { label: 'Estado', value: 'activo' },
]

const orderOptions = [
  { label: 'Ascendente', value: 'ASC' },
  { label: 'Descendente', value: 'DESC' },
]

const buildSearchParams = (filters: UsersFilters) => {
  const params = new URLSearchParams()

  params.set('page', filters.page)
  params.set('limit', filters.limit)
  params.set('orderBy', filters.orderBy)
  params.set('order', filters.order)

  if (filters.search) {
    params.set('search', filters.search)
  }

  return params
}

export function UsersPage() {
  const { filters, users } = useLoaderData() as UsersLoaderData
  const navigate = useNavigate()
  const navigation = useNavigation()
  const revalidator = useRevalidator()
  const currentUserEmail = useAuthStore((state) => state.user?.email)
  const accessToken = useAuthStore((state) => state.accessToken)
  const deactivateMe = useAuthStore((state) => state.deactivateMe)
  const getMe = useAuthStore((state) => state.me)
  const updateMe = useAuthStore((state) => state.updateMe)
  const getUser = useUserStore((state) => state.getUser)
  const [actionError, setActionError] = useState('')
  const { handleSubmit, register, reset } = useForm<UsersFilters>({
    defaultValues: filters,
  })
  const isLoading =
    navigation.state === 'loading' || revalidator.state === 'loading'

  const onSubmit = (values: UsersFilters) => {
    const params = buildSearchParams({ ...values, page: '1' })
    void navigate(`/app/usuarios?${params.toString()}`)
  }

  const onPageChange = (page: number) => {
    const params = buildSearchParams({ ...filters, page: String(page) })
    void navigate(`/app/usuarios?${params.toString()}`)
  }

  const onClear = () => {
    reset({
      limit: '10',
      order: 'ASC',
      orderBy: 'nombre',
      page: '1',
      search: '',
    })
    void navigate('/app/usuarios')
  }

  const onUpdateMe = async (payload: UpdateMePayload) => {
    setActionError('')

    try {
      await updateMe(payload)
      await revalidator.revalidate()
    } catch (error) {
      setActionError(
        error instanceof ApiError
          ? error.message
          : 'No se pudo actualizar tu usuario.',
      )
    }
  }

  const onDeactivateMe = async () => {
    setActionError('')

    try {
      await deactivateMe()
      await navigate('/login')
    } catch (error) {
      setActionError(
        error instanceof ApiError
          ? error.message
          : 'No se pudo dar de baja tu usuario.',
      )
    }
  }

  const onViewUser = async (id: string) => {
    if (!accessToken) {
      throw new Error('Sesion no disponible')
    }

    return getUser(id, accessToken)
  }

  return (
    <PageShell
      eyebrow="Directorio"
      title="Usuarios"
    >
      <div className="flex items-center justify-between gap-3">
        <Link className="w-fit text-sm font-semibold text-ash" to="/app">
          Volver al panel
        </Link>
        <p className="text-sm font-semibold text-ash">
          {users.meta.total} usuarios
        </p>
      </div>
      <form
        className="grid gap-4 rounded-2xl border border-line bg-white/92 p-5 shadow-[0_18px_55px_rgba(17,24,39,0.06)] md:grid-cols-[1.4fr_0.8fr_0.8fr_auto]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Buscar por nombre"
          placeholder="Nombre del usuario"
          {...register('search')}
        />
        <Select label="Ordenar por" options={orderByOptions} {...register('orderBy')} />
        <Select label="Direccion" options={orderOptions} {...register('order')} />
        <div className="flex gap-2 self-end">
          <Button disabled={isLoading} type="submit">
            {isLoading ? (
              <Spinner label="Buscando usuarios" size="sm" />
            ) : (
              <>
                <Search aria-hidden="true" size={16} />
                Filtrar
              </>
            )}
          </Button>
          <Button onClick={onClear} type="button" variant="secondary">
            Limpiar
          </Button>
        </div>
      </form>

      {actionError ? (
        <Notice title="Accion no disponible" variant="error">
          {actionError}
        </Notice>
      ) : null}

      {isLoading ? (
        <div className="grid min-h-40 place-items-center rounded-2xl border border-line bg-white/92 shadow-[0_18px_55px_rgba(17,24,39,0.06)]">
          <Spinner label="Cargando usuarios" size="lg" />
        </div>
      ) : (
        <>
          <UserList
            currentUserEmail={currentUserEmail}
            onDeactivateMe={onDeactivateMe}
            onUpdateMe={onUpdateMe}
            onViewMe={getMe}
            onViewUser={onViewUser}
            users={users.data}
          />
          <Pagination meta={users.meta} onPageChange={onPageChange} />
        </>
      )}
    </PageShell>
  )
}
