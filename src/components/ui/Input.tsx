import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label: string
}

export function Input({ error, id, label, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name

  return (
    <div className="grid gap-1.5">
      <label
        className="text-xs font-semibold uppercase tracking-[0.08em] text-ash"
        htmlFor={inputId}
      >
        {label}
      </label>
      <input
        aria-invalid={Boolean(error)}
        className={`min-h-11 rounded-md border border-line bg-white px-3 text-ink outline-none transition-colors placeholder:text-ash/60 focus:border-moss focus:ring-2 focus:ring-pistachio/70 ${className}`}
        id={inputId}
        {...props}
      />
      {error ? <p className="text-sm font-medium text-coral">{error}</p> : null}
    </div>
  )
}
