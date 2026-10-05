'use client'

import { useEffect, useState } from 'react'

import { ProductCard } from '@/components/ProductCard'
import { SectionHeading } from '@/components/SectionHeading'
import type { Gift } from '@/data/products'

const FeaturedGiftPackages = () => {
  const [products, setProducts] = useState<Gift[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/products?featured=1')
      .then((r) => r.json())
      .then((list: Gift[]) => setProducts(list.slice(0, 8)))
      .finally(() => setLoaded(true))
  }, [])

  return (
    <section>
      <SectionHeading
        title="Best Selling Gifts"
        subtitle="The presents shoppers keep coming back for, ranked by real orders."
        href="/gifts"
        linkLabel="View all gifts"
      />
      {loaded && products.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          No featured products yet — check the full catalog instead.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {loaded
            ? products.map((product) => <ProductCard key={product.id} product={product} />)
            : Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />
              ))}
        </div>
      )}
    </section>
  )
}

export default FeaturedGiftPackages
