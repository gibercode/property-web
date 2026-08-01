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
    <main className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-7 py-8 md:py-10">
      <header className="max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ash">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-lg text-ash">{description}</p>
        ) : null}
      </header>
      {children}
    </main>
  )
}
