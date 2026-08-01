import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from './Button'

type BackButtonProps = {
  label: string
  to: string
}

export function BackButton({ label, to }: BackButtonProps) {
  return (
    <Link to={to}>
      <Button className="min-h-9 px-3" variant="secondary">
        <ArrowLeft aria-hidden="true" size={16} />
        {label}
      </Button>
    </Link>
  )
}
