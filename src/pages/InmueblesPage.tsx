import { Plus, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import {
  Link,
  useLoaderData,
  useNavigate,
  useNavigation,
} from 'react-router'
import { InmuebleList } from '../components/inmuebles/InmuebleList'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { PageShell } from '../components/ui/PageShell'
import { Pagination } from '../components/ui/Pagination'
import { Select } from '../components/ui/Select'
import { Spinner } from '../components/ui/Spinner'
import { useAuthStore } from '../store/auth-store'
import type {
  InmueblesFilters,
  InmueblesLoaderData,
} from '../types/inmuebles'

const estadoOptions = [
  { label: 'Todos', value: '' },
  { label: 'Disponible', value: 'DISPONIBLE' },
  { label: 'Reservado', value: 'RESERVADO' },
  { label: 'Vendido', value: 'VENDIDO' },
]

const orderByOptions = [
  { label: 'Fecha', value: 'createdAt' },
  { label: 'Precio', value: 'precio' },
]

const orderOptions = [
  { label: 'Descendente', value: 'DESC' },
  { label: 'Ascendente', value: 'ASC' },
]

const buildSearchParams = (filters: InmueblesFilters) => {
  const params = new URLSearchParams()

  params.set('page', filters.page)
  params.set('limit', filters.limit)
  params.set('orderBy', filters.orderBy)
  params.set('order', filters.order)

  for (const key of [
    'estado',
    'tipoInmuebleId',
    'precioMin',
    'precioMax',
    'search',
    'soloMios',
  ] as const) {
    const value = filters[key]

    if (value && value !== 'false') {
      params.set(key, value)
    }
  }

  return params
}

export function InmueblesPage() {
  const { filters, inmuebles, tiposInmueble } =
    useLoaderData() as InmueblesLoaderData
  const navigate = useNavigate()
  const navigation = useNavigation()
  const currentUserEmail = useAuthStore((state) => state.user?.email)
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<InmueblesFilters>({
    defaultValues: {
      ...filters,
      soloMios: filters.soloMios === 'true' ? 'true' : '',
    },
  })
  const isLoading = navigation.state === 'loading'

  const onSubmit = (values: InmueblesFilters) => {
    const params = buildSearchParams({ ...values, page: '1' })
    void navigate(`/app/inmuebles?${params.toString()}`)
  }

  const onPageChange = (page: number) => {
    const params = buildSearchParams({ ...filters, page: String(page) })
    void navigate(`/app/inmuebles?${params.toString()}`)
  }

  const onClear = () => {
    reset({
      estado: '',
      limit: '10',
      order: 'DESC',
      orderBy: 'createdAt',
      page: '1',
      precioMax: '',
      precioMin: '',
      search: '',
      soloMios: '',
      tipoInmuebleId: '',
    })
    void navigate('/app/inmuebles')
  }

  return (
    <PageShell
      eyebrow="Inventario"
      title="Inmuebles"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link className="w-fit text-sm font-semibold text-ash" to="/app">
          Volver al panel
        </Link>
        <div className="flex items-center gap-3">
          <p className="hidden text-sm font-semibold text-ash sm:block">
            {inmuebles.meta.total} inmuebles
          </p>
          <Link to="/app/inmuebles/nuevo">
            <Button>
              <Plus aria-hidden="true" size={16} />
              Agregar inmueble
            </Button>
          </Link>
        </div>
      </div>
      <form
        className="grid gap-4 rounded-2xl border border-line bg-white/92 p-5 shadow-[0_18px_55px_rgba(17,24,39,0.06)] md:grid-cols-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Direccion"
          placeholder="Av. Principal"
          {...register('search')}
        />
        <Select label="Estado" options={estadoOptions} {...register('estado')} />
        <Select
          label="Tipo"
          options={[
            { label: 'Todos', value: '' },
            ...tiposInmueble.map((tipo) => ({
              label: tipo.nombre,
              value: tipo.id,
            })),
          ]}
          {...register('tipoInmuebleId')}
        />
        <Input
          error={errors.precioMin?.message}
          label="Precio minimo"
          min={1}
          placeholder="50000"
          type="number"
          {...register('precioMin', {
            min: { message: 'Debe ser mayor a 0.', value: 1 },
          })}
        />
        <Input
          error={errors.precioMax?.message}
          label="Precio maximo"
          min={1}
          placeholder="250000"
          type="number"
          {...register('precioMax', {
            min: { message: 'Debe ser mayor a 0.', value: 1 },
          })}
        />
        <label className="flex min-h-11 cursor-pointer items-center gap-3 self-end rounded-md border border-line bg-porcelain px-3 text-sm font-semibold text-ink">
          <input
            className="size-4 accent-zinc-900"
            type="checkbox"
            value="true"
            {...register('soloMios')}
          />
          Solo mis inmuebles
        </label>
        <Select label="Ordenar por" options={orderByOptions} {...register('orderBy')} />
        <Select label="Direccion" options={orderOptions} {...register('order')} />
        <div className="flex gap-2 self-end">
          <Button disabled={isLoading} type="submit">
            {isLoading ? (
              <Spinner label="Buscando inmuebles" size="sm" />
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

      {isLoading ? (
        <div className="grid min-h-40 place-items-center rounded-2xl border border-line bg-white/92 shadow-[0_18px_55px_rgba(17,24,39,0.06)]">
          <Spinner label="Cargando inmuebles" size="lg" />
        </div>
      ) : (
        <>
          <InmuebleList
            currentUserEmail={currentUserEmail}
            inmuebles={inmuebles.data}
          />
          <Pagination meta={inmuebles.meta} onPageChange={onPageChange} />
        </>
      )}
    </PageShell>
  )
}
