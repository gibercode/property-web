import { Building2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Notice } from '../components/ui/Notice'
import { Spinner } from '../components/ui/Spinner'
import { useAuthStore } from '../store/auth-store'
import type { LoginPayload } from '../types/auth'
import { ApiError } from '../utils/fetch-service'

export function LoginPage() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const login = useAuthStore((state) => state.login)
  const [formError, setFormError] = useState('')
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginPayload>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (payload: LoginPayload) => {
    setFormError('')

    try {
      await login(payload)
      await navigate('/app')
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : 'No se pudo iniciar sesion.',
      )
    }
  }

  return (
    <main className="grid min-h-svh place-items-center px-4 py-8">
      <div className="grid w-[min(960px,100%)] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_90px_rgba(24,24,27,0.12)] md:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden bg-ink p-8 text-paper md:grid md:content-between">
          <div>
            <span className="grid size-12 place-items-center rounded-xl bg-white/10">
              <Building2 aria-hidden="true" size={24} />
            </span>
            <p className="mt-5 text-3xl font-bold tracking-tight">INMO</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-paper/55">
              Gestion inmobiliaria
            </p>
            <p className="mt-3 text-2xl font-semibold leading-tight">
              Acceso privado para operar usuarios e inmuebles.
            </p>
          </div>
        </section>

        <section className="p-6 sm:p-8">
          <div className="flex items-center gap-3 md:hidden">
            <span className="grid size-10 place-items-center rounded-lg bg-ink text-paper">
              <Building2 aria-hidden="true" size={20} />
            </span>
            <p className="text-2xl font-bold tracking-tight text-ink">INMO</p>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-ash md:mt-0">
            Acceso
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">
            Login
          </h1>
          <p className="mt-3 text-sm text-ash">
            Entra para consultar el panel y mantener tu sesion activa.
          </p>

          {currentUser ? (
            <div className="mt-5 rounded-lg border border-line bg-porcelain p-4">
              <p className="text-sm font-semibold text-ink">
                Sesion iniciada como {currentUser.nombre}
              </p>
              <p className="mt-1 text-sm text-ash">{currentUser.email}</p>
              <Button className="mt-3" onClick={clearSession} variant="secondary">
                Cerrar sesion
              </Button>
            </div>
          ) : null}

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
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
              <Notice title="No se pudo iniciar sesion" variant="error">
                {formError}
              </Notice>
            ) : null}

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? <Spinner label="Entrando" size="sm" /> : 'Entrar'}
            </Button>
          </form>

          <p className="mt-5 text-sm text-ash">
            No tienes cuenta?{' '}
            <Link className="font-semibold text-ink underline" to="/registro">
              Crea una
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
