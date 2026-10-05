'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Pencil, Plus, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Gift } from '@/data/products'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Gift[]>([])
  const [loaded, setLoaded] = useState(false)
  const [q, setQ] = useState('')

  const load = () =>
    fetch('/api/products')
      .then((r) => r.json())
      .then((list: Gift[]) => setProducts(list))
      .finally(() => setLoaded(true))

  useEffect(() => {
    load()
  }, [])

  const remove = async (product: Gift) => {
    if (!confirm(`Delete “${product.name}”? This cannot be undone.`)) return
    const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== product.id))
  }

  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} products in the catalog</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> New product
          </Link>
        </Button>
      </div>

      <Input
        placeholder="Search products…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-sm"
      />

      {!loaded ? (
        <div className="rounded-xl border p-10 text-center text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          <Package className="mx-auto mb-2 h-8 w-8" aria-hidden />
          No products match.
        </div>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Variations</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image src={product.image} alt="" fill sizes="40px" className="object-cover" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{product.name}</p>
                          {product.tag ? (
                            <Badge variant="secondary" className="mt-0.5">{product.tag}</Badge>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{product.category}</td>
                    <td className="p-3 text-muted-foreground">{product.type}</td>
                    <td className="p-3 font-semibold">${product.price.toFixed(2)}</td>
                    <td className="p-3">
                      <Badge variant={(product.stock ?? 0) <= 10 ? 'destructive' : 'secondary'}>
                        {product.stock ?? 0}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {(product.variations ?? []).length} / {(product.customization ?? []).length}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" asChild aria-label={`Edit ${product.name}`}>
                          <Link href={`/admin/products/${product.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Delete ${product.name}`}
                          onClick={() => remove(product)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
