'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { ProductCard } from '@/components/ProductCard'
import { categoryById } from '@/data/categories'
import { categoryCounts, products } from '@/data/products'
import { categoryIcon } from '@/lib/icons'

export default function CategoryPage({ params }: { params: { id: string } }) {
  const category = categoryById(params.id)

  if (!category) {
    notFound()
  }

  const gifts = products.filter((product) => product.category === category.name)
  const CategoryIcon = categoryIcon(category.id)

  return (
    <div className="space-y-6">
      <Link
        href="/categories"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> All occasions
      </Link>

      <header className="rounded-2xl bg-[#000068] px-5 py-8 text-white sm:px-8 sm:py-10">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 sm:h-14 sm:w-14">
            <CategoryIcon className="h-6 w-6 text-gold sm:h-7 sm:w-7" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {categoryCounts[category.name] ?? 0} gifts
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {category.name}
            </h1>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-white/75 sm:text-base">{category.description}</p>
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
