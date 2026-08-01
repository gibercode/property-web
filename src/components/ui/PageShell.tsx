import type { ReactNode } from 'react'

type PageShellProps = {
  children: ReactNode
  eyebrow?: string
  title: string
  description?: string
}

export function PageShell({
  children,
  description,
  eyebrow,
  title,
}: PageShellProps) {
  return (
    <main className="mx-auto grid w-[min(1220px,calc(100%-32px))] gap-6 py-7 md:py-9">
      <header className="rounded-2xl border border-white/80 bg-white/72 px-5 py-5 shadow-[0_18px_55px_rgba(17,24,39,0.06)] backdrop-blur md:px-6">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ash">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 max-w-4xl text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ash md:text-base">{description}</p>
        ) : null}
      </header>
      {children}
    </main>
  )
}
