'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'

import { ProductCard } from '@/components/ProductCard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categories as seedCategories, giftTypes } from '@/data/categories'
import type { Gift } from '@/data/products'
import type { GiftCategory } from '@/data/categories'
import { giftTypeIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

function GiftCatalog() {
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? 'all')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') ?? 'all')
  const [products, setProducts] = useState<Gift[]>([])
  const [categories, setCategories] = useState<GiftCategory[]>(seedCategories)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ])
      .then(([prods, cats]) => {
        setProducts(prods)
        if (Array.isArray(cats) && cats.length) setCategories(cats)
      })
      .finally(() => setLoaded(true))
  }, [])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) &&
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      (selectedType === 'all' || product.type === selectedType)
  )

  if (!loaded) {
    return (
      <div className="rounded-xl border p-10 text-center text-muted-foreground">
        Loading the catalog…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl bg-[#000068] px-5 py-8 text-white sm:px-8 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {products.length} gifts · {categories.length} occasions · {giftTypes.length} types
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          The Gift Catalog
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
          Filter by occasion, gift type or name — every card is ready to add to your cart.
        </p>
      </header>

      {/* Filters */}
      <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
          <div className="space-y-1.5">
            <Label htmlFor="search">Search gifts</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                type="search"
                placeholder="Search for gifts…"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-11 pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category">Occasion</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category" className="h-11">
                <SelectValue placeholder="All occasions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All occasions</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Gift type
          </div>
          <div className="scrollbar-hidden -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={cn(
                'h-11 shrink-0 rounded-full border px-4 text-xs font-medium transition-colors sm:text-sm',
                selectedType === 'all'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:border-primary/40 hover:text-primary'
              )}
              aria-pressed={selectedType === 'all'}
            >
              All types
            </button>
            {giftTypes.map((type) => {
              const TypeIcon = giftTypeIcon(type.id)
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  aria-pressed={selectedType === type.id}
                  className={cn(
                    'inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition-colors sm:text-sm',
                    selectedType === type.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:border-primary/40 hover:text-primary'
                  )}
                >
                  <TypeIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {type.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredProducts.length} of {products.length} gifts
      </p>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">No gifts match those filters.</p>
          <button
            type="button"
            className="mt-2 text-sm font-medium text-primary hover:underline"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSelectedType('all')
            }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}

export default function GiftCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl border p-10 text-center text-muted-foreground">
          Loading gifts…
        </div>
      }
    >
      <GiftCatalog />
    </Suspense>
  )
}
