import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { productsByType } from '@/data/products'
import type { GiftType } from '@/data/categories'
import { cn } from '@/lib/utils'

const CARD_SIZES =
  '(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 50vw, 50vw'

export function TypeCard({ type, className }: { type: GiftType; className?: string }) {
  const count = productsByType(type.id).length

  return (
    <Link
      href={`/gifts?type=${type.id}`}
      aria-label={`${type.name}, ${count} gifts`}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={type.image}
          alt=""
          fill
          sizes={CARD_SIZES}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-sm font-semibold leading-snug sm:text-base">{type.name}</h3>
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

export default TypeCard
