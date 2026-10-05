'use client'

import { products } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'
import { SectionHeading } from '@/components/SectionHeading'

const bestSellers = [
  ...products.filter((product) => product.tag === 'Bestseller'),
  ...products.filter((product) => product.tag === 'New'),
  ...products.filter((product) => product.tag === 'Premium'),
].slice(0, 8)

const FeaturedGiftPackages = () => {
  return (
    <section>
      <SectionHeading
        title="Best Selling Gifts"
        subtitle="The presents shoppers keep coming back for, ranked by real orders."
        href="/gifts"
        linkLabel="View all gifts"
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default FeaturedGiftPackages
