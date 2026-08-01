type NoticeProps = {
  children: string
  title: string
  variant?: 'error' | 'empty' | 'success'
}

const variants = {
  empty: 'border-line bg-white text-ash',
  error: 'border-coral bg-coral/10 text-ink',
  success: 'border-moss bg-pistachio/30 text-ink',
}

export function Notice({ children, title, variant = 'empty' }: NoticeProps) {
  return (
    <div className={`rounded-lg border p-5 ${variants[variant]}`}>
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm">{children}</p>
    </div>
  )
}
