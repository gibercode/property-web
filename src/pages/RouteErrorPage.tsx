import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { Button } from "../components/ui/Button";
import { ApiError } from "../utils/fetch-service";

const getErrorMessage = (error: unknown) => {
  if (isRouteErrorResponse(error)) {
    return error.statusText || "La ruta no pudo cargar.";
  }

  if (error instanceof ApiError || error instanceof Error) {
    return error.message;
  }

  return "Ocurrio un error inesperado.";
};

export function RouteErrorPage() {
  const error = useRouteError();

  return (
    <main className="mx-auto grid min-h-svh w-[min(640px,calc(100%-32px))] content-center py-10">
      <div className="rounded-lg border border-coral bg-coral/10 p-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-moss">
          Error
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none">
          No se pudo cargar la vista.
        </h1>
        <p className="mt-4 text-ash">{getErrorMessage(error)}</p>
        <Link className="mt-6 inline-flex" to="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </main>
  );
}
