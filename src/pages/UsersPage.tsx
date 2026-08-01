import { useForm } from 'react-hook-form'
import { Link, useLoaderData, useNavigate, useNavigation } from 'react-router'
import { UserList } from '../components/users/UserList'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { PageShell } from '../components/ui/PageShell'
import { Pagination } from '../components/ui/Pagination'
import { Select } from '../components/ui/Select'
import { Spinner } from '../components/ui/Spinner'
import type { UsersFilters, UsersLoaderData } from '../types/users'

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
  const { handleSubmit, register, reset } = useForm<UsersFilters>({
    defaultValues: filters,
  })
  const isLoading = navigation.state === 'loading'

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

  return (
    <PageShell
      description="Busqueda por nombre, orden y paginacion enviados al servidor."
      eyebrow="Directorio"
      title="Usuarios"
    >
      <Link className="w-fit text-sm font-semibold underline" to="/app">
        Volver al panel
      </Link>
      <form
        className="grid gap-4 rounded-lg border border-line bg-white p-5 md:grid-cols-[1.4fr_0.8fr_0.8fr_auto]"
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
            {isLoading ? <Spinner label="Buscando usuarios" size="sm" /> : 'Filtrar'}
          </Button>
          <Button onClick={onClear} type="button" variant="secondary">
            Limpiar
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="grid min-h-40 place-items-center rounded-lg border border-line bg-white">
          <Spinner label="Cargando usuarios" size="lg" />
        </div>
      ) : (
        <>
          <UserList users={users.data} />
          <Pagination meta={users.meta} onPageChange={onPageChange} />
        </>
      )}
    </PageShell>
  )
}
