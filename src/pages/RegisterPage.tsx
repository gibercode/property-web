import { Building2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Notice } from '../components/ui/Notice'
import { Spinner } from '../components/ui/Spinner'
import { useAuthStore } from '../store/auth-store'
import type { RegisterPayload } from '../types/auth'
import { ApiError } from '../utils/fetch-service'

export function RegisterPage() {
  const navigate = useNavigate()
  const registerUser = useAuthStore((state) => state.register)
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<RegisterPayload>({
    defaultValues: {
      email: '',
      nombre: '',
      password: '',
    },
  })

  const onSubmit = async (payload: RegisterPayload) => {
    setFormError('')
    setSuccess('')

    try {
      await registerUser(payload)
      setSuccess('Usuario registrado. Ya puedes iniciar sesion.')
      window.setTimeout(() => void navigate('/login'), 2000)
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : 'No se pudo completar el registro.',
      )
    }
  }

  return (
    <main className="grid min-h-svh place-items-center px-4 py-8">
      <div className="grid w-[min(980px,100%)] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_90px_rgba(24,24,27,0.12)] md:grid-cols-[1.1fr_0.9fr]">
        <section className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-ink text-paper">
              <Building2 aria-hidden="true" size={20} />
            </span>
            <p className="text-2xl font-bold tracking-tight text-ink">INMO</p>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-ash">
            Nueva cuenta
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">
            Registro
          </h1>
          <p className="mt-3 text-sm text-ash">
            Crea un usuario para autenticarte contra property-api.
          </p>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              error={errors.nombre?.message}
              label="Nombre"
              placeholder="Tu nombre"
              {...register('nombre', {
                maxLength: {
                  message: 'Maximo 150 caracteres.',
                  value: 150,
                },
                minLength: {
                  message: 'Minimo 2 caracteres.',
                  value: 2,
                },
                required: 'El nombre es requerido.',
              })}
            />
            <Input
              error={errors.email?.message}
              label="Email"
              placeholder="tu@email.com"
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
                required: 'El email es requerido.',
              })}
            />
            <Input
              error={errors.password?.message}
              label="Password"
              placeholder="Minimo 8 caracteres"
              type="password"
              {...register('password', {
                maxLength: {
                  message: 'Maximo 72 caracteres.',
                  value: 72,
                },
                minLength: {
                  message: 'Minimo 8 caracteres.',
                  value: 8,
                },
                required: 'El password es requerido.',
              })}
            />

            {formError ? (
              <Notice title="No se pudo registrar" variant="error">
                {formError}
              </Notice>
            ) : null}
            {success ? (
              <Notice title="Registro completado" variant="success">
                {success}
              </Notice>
            ) : null}

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <Spinner label="Creando cuenta" size="sm" />
              ) : (
                'Crear cuenta'
              )}
            </Button>
          </form>

          <p className="mt-5 text-sm text-ash">
            Ya tienes cuenta?{' '}
            <Link className="font-semibold text-ink underline" to="/login">
              Entra
            </Link>
          </p>
        </section>

        <section className="hidden bg-ink p-8 text-paper md:grid md:content-between">
          <span className="grid size-12 place-items-center rounded-xl bg-white/10">
            <Building2 aria-hidden="true" size={24} />
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-paper/55">
              Alta de usuario
            </p>
            <p className="mt-3 text-2xl font-semibold leading-tight">
              Una cuenta para consultar inventario, usuarios y operaciones.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
