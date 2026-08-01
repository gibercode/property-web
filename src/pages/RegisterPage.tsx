import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import type { RegisterPayload } from "../types/auth";
import { useAuthStore } from "../store/auth-store";
import { ApiError } from "../utils/fetch-service";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Notice } from "../components/ui/Notice";
import { Spinner } from "../components/ui/Spinner";

export function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<RegisterPayload>({
    defaultValues: {
      email: "",
      nombre: "",
      password: "",
    },
  });

  const onSubmit = async (payload: RegisterPayload) => {
    setFormError("");
    setSuccess("");

    try {
      await registerUser(payload);
      setSuccess("Usuario registrado. Ya puedes iniciar sesion.");
      window.setTimeout(() => void navigate("/login"), 2000);
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "No se pudo completar el registro.",
      );
    }
  };

  return (
    <main className="mx-auto grid min-h-[calc(100svh-4rem)] w-[min(520px,calc(100%-32px))] content-center py-10">
      <div className="rounded-lg border border-line bg-white p-6 shadow-[0_24px_70px_rgba(23,20,18,0.08)]">
        <p className="text-2xl font-bold tracking-tight text-ink">INMO</p>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-moss">
          Nueva cuenta
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none">Registro</h1>
        <p className="mt-3 text-sm text-ash">
          Crea un usuario para autenticarte contra property-api.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            error={errors.nombre?.message}
            label="Nombre"
            placeholder="Tu nombre"
            {...register("nombre", {
              maxLength: {
                message: "Maximo 150 caracteres.",
                value: 150,
              },
              minLength: {
                message: "Minimo 2 caracteres.",
                value: 2,
              },
              required: "El nombre es requerido.",
            })}
          />
          <Input
            error={errors.email?.message}
            label="Email"
            placeholder="tu@email.com"
            type="email"
            {...register("email", {
              maxLength: {
                message: "Maximo 255 caracteres.",
                value: 255,
              },
              pattern: {
                message: "Ingresa un email valido.",
                value: /^\S+@\S+\.\S+$/,
              },
              required: "El email es requerido.",
            })}
          />
          <Input
            error={errors.password?.message}
            label="Password"
            placeholder="Minimo 8 caracteres"
            type="password"
            {...register("password", {
              maxLength: {
                message: "Maximo 72 caracteres.",
                value: 72,
              },
              minLength: {
                message: "Minimo 8 caracteres.",
                value: 8,
              },
              required: "El password es requerido.",
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
              "Crear cuenta"
            )}
          </Button>
        </form>

        <p className="mt-5 text-sm text-ash">
          Ya tienes cuenta?{" "}
          <Link className="font-semibold text-moss underline" to="/login">
            Entra
          </Link>
        </p>
      </div>
    </main>
  );
}
