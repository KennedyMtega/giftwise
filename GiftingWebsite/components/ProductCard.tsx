'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/context/CartContext'
import { giftTypeById } from '@/data/categories'
import { giftTypeIcon } from '@/lib/icons'
import type { Gift } from '@/data/products'

const IMAGE_SIZES =
  '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw'

export function ProductCard({ product }: { product: Gift }) {
  const { addToCart } = useCart()
  const type = giftTypeById(product.type)
  const TypeIcon = giftTypeIcon(product.type)

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/70 shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/gifts/${product.id}`}
        className="relative block aspect-square w-full overflow-hidden bg-muted"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={IMAGE_SIZES}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.tag ? (
          <Badge className="absolute left-2 top-2 border-transparent bg-primary text-primary-foreground">
            {product.tag}
          </Badge>
        ) : null}
        <span
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-sm ring-1 ring-border/70"
          title={type?.name}
        >
          <TypeIcon className="h-4 w-4 text-primary" aria-hidden />
          <span className="sr-only">{type?.name}</span>
        </span>
      </Link>

      <CardContent className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {type?.name}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug sm:text-base">
          <Link href={`/gifts/${product.id}`} className="transition-colors hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-base font-bold text-primary sm:text-lg">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="icon"
            className="h-11 w-11 shrink-0"
            aria-label={`Add ${product.name} to cart`}
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
              })
            }
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
