'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/context/CartContext'
import { products } from '@/data/products'

export default function GiftItemPage({ params }: { params: { id: string } }) {
  const [giftItem, setGiftItem] = useState<any>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchGiftItem = async () => {
      // In a real app, you would fetch this data from an API
      const foundItem = products.find(item => item.id === params.id)
      if (foundItem) {
        setGiftItem(foundItem)
      } else {
        notFound()
      }
    }

    fetchGiftItem()
  }, [params.id])

  if (!giftItem) {
    return <div>Loading...</div>
  }

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
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{giftItem.name}</CardTitle>
          <CardDescription>Category: {giftItem.category}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Image
            src={giftItem.image}
            alt={giftItem.name}
            width={300}
            height={300}
            className="w-full h-auto rounded-lg"
          />
          <p className="text-lg">{giftItem.description || 'No description available.'}</p>
          <p className="text-2xl font-bold text-primary">${giftItem.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" onClick={handleAddToCart}>Add to Cart</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

