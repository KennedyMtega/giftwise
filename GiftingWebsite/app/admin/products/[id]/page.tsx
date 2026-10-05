'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { ProductForm } from '@/components/admin/ProductForm'
import type { Gift } from '@/data/products'

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Gift | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(async (res) => {
        if (res.status === 404) setMissing(true)
        else setProduct(await res.json())
      })
      .catch(() => setMissing(true))
  }, [params.id])

  if (missing) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="font-medium">Product not found</p>
        <Link href="/admin/products" className="mt-2 inline-block text-sm text-primary hover:underline">
          Back to products
        </Link>
      </div>
    )
  }

  if (!product) {
    return <div className="rounded-xl border p-10 text-center text-muted-foreground">Loading…</div>
  }

  return <ProductForm product={product} />
}
