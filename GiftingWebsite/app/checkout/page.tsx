'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { cartItems, total, clearCart } = useCart()
  const { session } = useAuth()
  const router = useRouter()
  const [placing, setPlacing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
  })

  useEffect(() => {
    if (session) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || session.name,
        email: prev.email || session.email,
        address: prev.address || session.address || '',
      }))
    }
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (placing) return
    setPlacing(true)
    try {
      const order = {
        email: formData.email,
        customer: formData.name,
        total,
        address: `${formData.address}, ${formData.city} ${formData.zipCode}, ${formData.country}`,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          variations: item.variations,
          customization: item.customization,
        })),
      }
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })
      if (res.ok) {
        const created = await res.json()
        localStorage.setItem('gw_last_order', JSON.stringify(created))
      }
      clearCart()
      router.push('/order-confirmation')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.map((item) => (
              <div key={item.key} className="mb-3">
                <div className="flex justify-between items-center">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                {Object.entries(item.variations ?? {}).length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {Object.entries(item.variations ?? {}).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                  </p>
                )}
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSubmit()} className="w-full" disabled={placing || cartItems.length === 0}>
              {placing ? 'Placing order…' : 'Place Order'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

