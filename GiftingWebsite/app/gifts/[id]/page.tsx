'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Gift, ShieldCheck, Truck } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/context/CartContext'
import { categories, giftTypeById } from '@/data/categories'
import { products } from '@/data/products'
import { giftTypeIcon } from '@/lib/icons'

const assurances = [
  { icon: Truck, label: 'Same-day dispatch before 2pm' },
  { icon: Gift, label: 'Free wrapping and gift note' },
  { icon: ShieldCheck, label: '30-day free returns' },
]

export default function GiftItemPage({ params }: { params: { id: string } }) {
  const giftItem = products.find((item) => item.id === params.id)
  const { addToCart } = useCart()

  if (!giftItem) {
    notFound()
  }

  const type = giftTypeById(giftItem.type)
  const TypeIcon = giftTypeIcon(giftItem.type)
  const categorySlug = categories.find((category) => category.name === giftItem.category)?.id

  const handleAddToCart = () => {
    addToCart({
      id: giftItem.id,
      name: giftItem.name,
      price: giftItem.price,
      quantity: 1,
      image: giftItem.image,
    })
  }

  return (
    <div className="space-y-6">
      <Link
        href="/gifts"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to all gifts
      </Link>

      <Card className="mx-auto max-w-4xl overflow-hidden">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="relative aspect-square w-full bg-muted md:aspect-auto md:min-h-[22rem]">
            <Image
              src={giftItem.image}
              alt={giftItem.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col p-5 sm:p-6">
            <CardHeader className="p-0">
              <div className="flex flex-wrap items-center gap-2">
                {giftItem.tag ? (
                  <Badge className="border-transparent bg-primary text-primary-foreground">
                    {giftItem.tag}
                  </Badge>
                ) : null}
                <Badge variant="secondary" className="gap-1.5">
                  <TypeIcon className="h-3.5 w-3.5" aria-hidden />
                  {type?.name}
                </Badge>
              </div>
              <CardTitle className="mt-3 text-2xl leading-tight sm:text-3xl">
                {giftItem.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {categorySlug ? (
                  <Link
                    href={`/categories/${categorySlug}`}
                    className="hover:text-primary hover:underline"
                  >
                    {giftItem.category}
                  </Link>
                ) : (
                  giftItem.category
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 pt-4">
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {giftItem.description}
              </p>

              <p className="mt-4 text-3xl font-bold text-primary sm:text-4xl">
                ${giftItem.price.toFixed(2)}
              </p>

              <ul className="mt-4 space-y-2">
                {assurances.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm"
                  >
                    <item.icon className="h-4 w-4 shrink-0 text-primary" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 p-0 pt-6 sm:flex-row">
              <Button size="lg" className="h-12 w-full sm:flex-1" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full sm:w-auto sm:px-6"
              >
                <Link href="/cart">View Cart</Link>
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  )
}
