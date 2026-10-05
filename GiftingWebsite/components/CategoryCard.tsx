import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { categoryCounts } from '@/data/products'
import type { GiftCategory } from '@/data/categories'
import { categoryIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

export function CategoryCard({
  category,
  className,
}: {
  category: GiftCategory
  className?: string
}) {
  const count = categoryCounts[category.name] ?? 0
  const Icon = categoryIcon(category.id)

  return (
    <Link
      href={`/categories/${category.id}`}
      aria-label={`${category.name}, ${count} gifts`}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
        className
      )}
    >
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-accent to-gold/25">
        <Icon
          className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10"
          aria-hidden
        />
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-sm font-semibold leading-snug sm:text-base">{category.name}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <p className="text-xs text-muted-foreground">{count} gifts</p>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent transition-colors group-hover:bg-primary">
            <ArrowRight
              className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:text-primary-foreground"
              aria-hidden
            />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
