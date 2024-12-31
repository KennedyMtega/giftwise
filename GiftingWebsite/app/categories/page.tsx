'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const categories = [
  { id: '1', name: 'Birthday Gifts', description: 'Find the perfect birthday gift for your loved ones' },
  { id: '2', name: 'Anniversary Gifts', description: 'Celebrate love with our curated anniversary gifts' },
  { id: '3', name: 'Wedding Gifts', description: 'Unique gifts for the newlyweds' },
  { id: '4', name: 'Graduation Gifts', description: 'Celebrate academic achievements with thoughtful gifts' },
  { id: '5', name: 'Holiday Gifts', description: 'Spread joy with our festive holiday gift selection' },
  { id: '6', name: 'Housewarming Gifts', description: 'Welcome friends to their new home with these perfect gifts' },
  { id: '7', name: 'Baby Shower Gifts', description: 'Celebrate new life with adorable and practical baby gifts' },
  { id: '8', name: 'Retirement Gifts', description: 'Honor a career well-spent with meaningful retirement presents' },
  { id: '9', name: 'Thank You Gifts', description: 'Express your gratitude with these thoughtful thank you gifts' },
  { id: '10', name: 'Get Well Gifts', description: 'Send wishes for a speedy recovery with comforting get well gifts' },
  { id: '11', name: 'Corporate Gifts', description: 'Impress clients and employees with professional corporate gifts' },
  { id: '12', name: 'Self-Care Gifts', description: 'Encourage relaxation and wellness with self-care gift ideas' },
]

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Gift Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{category.description}</p>
              <Link
                href={`/categories/${category.id}`}
                className="text-primary hover:underline"
              >
                Explore {category.name}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

