type SpinnerProps = {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-10 border-[3px]',
}

export function Spinner({ label = 'Cargando', size = 'md' }: SpinnerProps) {
  return (
    <span className="inline-flex items-center justify-center" role="status">
      <span
        aria-hidden="true"
        className={`${sizes[size]} animate-spin rounded-full border-line border-t-ink`}
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}
