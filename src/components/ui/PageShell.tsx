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
    <main className="mx-auto grid w-[min(1120px,calc(100%-32px))] gap-8 py-10">
      <header className="max-w-3xl">
        {eyebrow ? (
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-moss">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 font-display text-5xl leading-none text-ink sm:text-6xl">
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
