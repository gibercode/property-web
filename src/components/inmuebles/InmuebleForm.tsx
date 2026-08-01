import { useForm } from 'react-hook-form'
import type {
  InmuebleFormValues,
  InmueblePayload,
  TipoInmueble,
} from '../../types/inmuebles'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Spinner } from '../ui/Spinner'

type InmuebleFormProps = {
  defaultValues?: Partial<InmuebleFormValues>
  isSubmitting?: boolean
  onCancel?: () => void
  onSubmit: (payload: InmueblePayload) => Promise<void>
  submitLabel: string
  tiposInmueble: TipoInmueble[]
}

export function InmuebleForm({
  defaultValues,
  isSubmitting = false,
  onCancel,
  onSubmit,
  submitLabel,
  tiposInmueble,
}: InmuebleFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<InmuebleFormValues>({
    defaultValues: {
      direccion: defaultValues?.direccion ?? '',
      habitaciones: defaultValues?.habitaciones ?? 0,
      metrosCuadrados: defaultValues?.metrosCuadrados ?? 1,
      precio: defaultValues?.precio ?? 1,
      tipoInmuebleId: defaultValues?.tipoInmuebleId ?? '',
    },
  })

  const submit = async (values: InmuebleFormValues) => {
    await onSubmit({
      direccion: values.direccion,
      habitaciones: Number(values.habitaciones),
      metrosCuadrados: Number(values.metrosCuadrados),
      precio: Number(values.precio),
      tipoInmuebleId: values.tipoInmuebleId,
    })
  }

  return (
    <form
      className="grid gap-4 rounded-2xl border border-line bg-white/95 p-5 shadow-[0_18px_55px_rgba(17,24,39,0.06)] md:grid-cols-2"
      onSubmit={handleSubmit(submit)}
    >
      <Input
        error={errors.direccion?.message}
        label="Direccion"
        placeholder="Av. Principal"
        {...register('direccion', {
          maxLength: {
            message: 'Maximo 255 caracteres.',
            value: 255,
          },
          required: 'La direccion es requerida.',
        })}
      />
      <Select
        error={errors.tipoInmuebleId?.message}
        label="Tipo"
        options={[
          { label: 'Selecciona un tipo', value: '' },
          ...tiposInmueble.map((tipo) => ({
            label: tipo.nombre,
            value: tipo.id,
          })),
        ]}
        {...register('tipoInmuebleId', {
          required: 'El tipo es requerido.',
        })}
      />
      <Input
        error={errors.precio?.message}
        label="Precio"
        min={1}
        type="number"
        {...register('precio', {
          min: {
            message: 'Debe ser mayor a 0.',
            value: 1,
          },
          required: 'El precio es requerido.',
          valueAsNumber: true,
        })}
      />
      <Input
        error={errors.habitaciones?.message}
        label="Habitaciones"
        min={0}
        type="number"
        {...register('habitaciones', {
          min: {
            message: 'No puede ser negativo.',
            value: 0,
          },
          required: 'Las habitaciones son requeridas.',
          valueAsNumber: true,
        })}
      />
      <Input
        error={errors.metrosCuadrados?.message}
        label="Metros cuadrados"
        min={1}
        type="number"
        {...register('metrosCuadrados', {
          min: {
            message: 'Debe ser mayor a 0.',
            value: 1,
          },
          required: 'Los metros cuadrados son requeridos.',
          valueAsNumber: true,
        })}
      />
      <div className="flex gap-2 self-end">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? <Spinner label={submitLabel} size="sm" /> : submitLabel}
        </Button>
        {onCancel ? (
          <Button onClick={onCancel} type="button" variant="secondary">
            Cancelar
          </Button>
        ) : null}
      </div>
    </form>
  )
}
