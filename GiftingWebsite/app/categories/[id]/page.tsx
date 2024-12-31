'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import { products } from '@/data/products'

const categories = [
  { id: '1', name: 'Birthday Gifts' },
  { id: '2', name: 'Anniversary Gifts' },
  { id: '3', name: 'Wedding Gifts' },
  { id: '4', name: 'Graduation Gifts' },
  { id: '5', name: 'Holiday Gifts' },
  { id: '6', name: 'Housewarming Gifts' },
  { id: '7', name: 'Baby Shower Gifts' },
  { id: '8', name: 'Retirement Gifts' },
  { id: '9', name: 'Thank You Gifts' },
  { id: '10', name: 'Get Well Gifts' },
  { id: '11', name: 'Corporate Gifts' },
  { id: '12', name: 'Self-Care Gifts' },
]

export default function CategoryPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = useState<any>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchCategory = async () => {
      const foundCategory = categories.find(cat => cat.id === params.id)
      if (foundCategory) {
        const categoryProducts = products.filter(product => product.category === foundCategory.name)
        setCategory({ ...foundCategory, gifts: categoryProducts })
      } else {
        notFound()
      }
    }

    fetchCategory()
  }, [params.id])

  if (!category) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-8">{category.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.gifts.map((gift: any) => (
          <Card key={gift.id}>
            <CardHeader>
              <Image
                src={gift.image}
                alt={gift.name}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">{gift.name}</CardTitle>
              <p className="text-2xl font-bold text-primary mt-2">${gift.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild variant="outline">
                <Link href={`/gifts/${gift.id}`}>View Details</Link>
              </Button>
              <Button onClick={() => addToCart({ id: gift.id, name: gift.name, price: gift.price, quantity: 1, image: gift.image })}>Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

