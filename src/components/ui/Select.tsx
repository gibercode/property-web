import type { SelectHTMLAttributes } from 'react'

type SelectOption = {
  label: string
  value: string
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string
  label: string
  options: SelectOption[]
}

export function Select({
  error,
  id,
  label,
  options,
  className = '',
  ...props
}: SelectProps) {
  const selectId = id ?? props.name

  return (
    <div className="grid gap-1.5">
      <label
        className="text-xs font-semibold uppercase tracking-[0.08em] text-ash"
        htmlFor={selectId}
      >
        {label}
      </label>
      <select
        aria-invalid={Boolean(error)}
        className={`min-h-11 rounded-md border border-line bg-white px-3 text-ink outline-none transition-colors focus:border-moss focus:ring-2 focus:ring-pistachio/70 ${className}`}
        id={selectId}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm font-medium text-coral">{error}</p> : null}
    </div>
  )
}
