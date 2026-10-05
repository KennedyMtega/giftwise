import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function SectionHeading({
  title,
  subtitle,
  href,
  linkLabel,
}: {
  title: string
  subtitle?: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">{title}</h2>
        {subtitle ? (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {linkLabel ?? 'View all'}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  )
}

export default SectionHeading
