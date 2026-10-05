'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ProductCard'
import type { GiftCategory } from '@/data/categories'
import type { Gift } from '@/data/products'
import { categoryIcon } from '@/lib/icons'

export default function CategoryPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = useState<GiftCategory | null>(null)
  const [gifts, setGifts] = useState<Gift[]>([])
  const [missing, setMissing] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
    ])
      .then(([cats, prods]) => {
        const found = (cats as GiftCategory[]).find((c) => c.id === params.id)
        if (!found) {
          setMissing(true)
          return
        }
        setCategory(found)
        setGifts((prods as Gift[]).filter((p) => p.category === found.name))
      })
      .catch(() => setMissing(true))
      .finally(() => setLoaded(true))
  }, [params.id])

  if (!loaded) {
    return <div className="rounded-xl border p-10 text-center text-muted-foreground">Loading…</div>
  }

  if (missing || !category) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <h1 className="text-2xl font-bold">Occasion not found</h1>
        <p className="mt-2 text-muted-foreground">It may have been removed by the store admin.</p>
        <Button asChild className="mt-4">
          <Link href="/categories">All occasions</Link>
        </Button>
      </div>
    )
  }

  const CategoryIcon = categoryIcon(category.id)
  const count = gifts.length

  return (
    <div className="space-y-6">
      <Link
        href="/categories"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> All occasions
      </Link>

      <header className="relative overflow-hidden rounded-2xl bg-[#000068] text-white">
        <div className="relative px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 sm:h-14 sm:w-14">
              <CategoryIcon className="h-6 w-6 text-gold sm:h-7 sm:w-7" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {count} gifts
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                {category.name}
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-white/75 sm:text-base">
            {category.description}
          </p>
        </div>
      </header>

      {gifts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {gifts.map((gift) => (
            <ProductCard key={gift.id} product={gift} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          No gifts here yet.{' '}
          <Link href="/gifts" className="font-medium text-primary hover:underline">
            Browse everything
          </Link>
        </div>
      )}
    </div>
  )
}
