import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white shadow-[0_12px_24px_rgba(17,24,39,0.16)]',
  secondary: 'border border-line bg-white text-ink shadow-[0_8px_20px_rgba(17,24,39,0.05)]',
  danger: 'bg-coral text-white shadow-[0_12px_24px_rgba(181,71,59,0.16)]',
}

export function Button({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-[box-shadow,transform] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
