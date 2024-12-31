'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/context/CartContext'
import { products } from '@/data/products'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function GiftCatalogPage() {
  const { addToCart } = useCart()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = Array.from(new Set(products.map(product => product.category)))

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || product.category === selectedCategory)
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Gift Catalog</h1>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Search Gifts</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search for gifts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Label htmlFor="category">Filter by Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <Image
                src={item.image}
                alt={item.name}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="text-2xl font-bold text-primary mt-2">${item.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild variant="outline">
                <Link href={`/gifts/${item.id}`}>View Details</Link>
              </Button>
              <Button onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, quantity: 1, image: item.image })}>
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

