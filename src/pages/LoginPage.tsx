import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import type { LoginPayload } from '../types/auth'
import { useAuthStore } from '../store/auth-store'
import { ApiError } from '../utils/fetch-service'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Notice } from '../components/ui/Notice'
import { Spinner } from '../components/ui/Spinner'

export function LoginPage() {
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
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : 'No se pudo iniciar sesion.',
      )
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100svh-4rem)] w-[min(480px,calc(100%-32px))] content-center py-10">
      <div className="rounded-lg border border-line bg-white p-6 shadow-[0_24px_70px_rgba(23,20,18,0.08)]">
        <p className="text-2xl font-bold tracking-tight text-ink">INMO</p>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-moss">
          Acceso
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none">Login</h1>
        <p className="mt-3 text-sm text-ash">
          Entra para guardar tu sesion y datos de usuario en el estado global.
        </p>

        {currentUser ? (
          <div className="mt-5 rounded-md border border-line bg-porcelain p-4">
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
          <Link className="font-semibold text-moss underline" to="/registro">
            Crea una
          </Link>
        </p>
      </div>
    </main>
  )
}
