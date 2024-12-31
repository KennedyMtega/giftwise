'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, CreditCard, HelpCircle, Settings, Gift, Wallet, PlusCircle, LogOut } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: {
      region: 'California',
      country: 'United States'
    },
    currency: 'USD',
    subscriptionType: 'Premium',
    walletBalance: 250.00,
  })

  const [addFundsAmount, setAddFundsAmount] = useState('')
  const [addFundsMethod, setAddFundsMethod] = useState('creditCard')

  const favoriteProducts = [
    { id: 1, name: 'Luxury Scented Candle Set', price: 34.99 },
    { id: 2, name: 'Personalized Photo Album', price: 29.99 },
    { id: 3, name: 'Gourmet Chocolate Box', price: 39.99 },
  ]

  const recentTransactions = [
    { id: 1, description: 'Birthday Gift for Mom', amount: -89.99, date: '2023-05-10' },
    { id: 2, description: 'Contribution from Alice', amount: 50.00, date: '2023-05-08' },
    { id: 3, description: 'Anniversary Gift for Sarah', amount: -129.99, date: '2023-05-05' },
  ]

  const supporters = [
    { id: 1, name: 'Alice Johnson', amount: 50.00 },
    { id: 2, name: 'Bob Smith', amount: 25.00 },
    { id: 3, name: 'Carol Williams', amount: 75.00 },
  ]

  const handleAddFunds = () => {
    // Here you would typically integrate with a payment API
    console.log(`Adding ${addFundsAmount} via ${addFundsMethod}`)
    setUser(prevUser => ({
      ...prevUser,
      walletBalance: prevUser.walletBalance + Number(addFundsAmount)
    }))
  }

  const handleLogout = () => {
    // Here you would typically clear the authentication state
    // For now, we'll just redirect to the login page
    router.push('/auth')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>{user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Location:</span>
                <span>{user.location.region}, {user.location.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Currency:</span>
                <span>{user.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Subscription:</span>
                <Badge>{user.subscriptionType}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${user.walletBalance.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Available Balance</p>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Add Funds</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Funds to Wallet</DialogTitle>
                  <DialogDescription>
                    Choose an amount and payment method to add funds to your wallet.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      className="col-span-3"
                      value={addFundsAmount}
                      onChange={(e) => setAddFundsAmount(e.target.value)}
                    />
                  </div>
                  <RadioGroup defaultValue="creditCard" onValueChange={setAddFundsMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="creditCard" id="creditCard" />
                      <Label htmlFor="creditCard">Credit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bankTransfer" id="bankTransfer" />
                      <Label htmlFor="bankTransfer">Bank Transfer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddFunds}>Add Funds</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="favorites" className="mt-6">
        <TabsList>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="supporters">Supporters</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {favoriteProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center mb-2">
                    <span>{product.name}</span>
                    <span>${product.price.toFixed(2)}</span>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex justify-between items-center mb-2">
                    <div>
                      <div>{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">{transaction.date}</div>
                    </div>
                    <span className={transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="supporters">
          <Card>
            <CardHeader>
              <CardTitle>Supporters</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {supporters.map(supporter => (
                  <div key={supporter.id} className="flex justify-between items-center mb-2">
                    <span>{supporter.name}</span>
                    <span>${supporter.amount.toFixed(2)}</span>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No upcoming events. Add some events to see them here!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Purchased</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/most-purchased" className="text-primary hover:underline flex items-center">
              <Gift className="mr-2 h-4 w-4" />
              View Most Purchased Items
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/notifications" className="text-primary hover:underline flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              View Notifications
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/settings" className="text-primary hover:underline flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Manage Settings
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Help Center</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/help-center" className="text-primary hover:underline flex items-center">
              <HelpCircle className="mr-2 h-4 w-4" />
              Visit Help Center
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Vouchers</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You have no active vouchers. Check back later for special offers!</p>
        </CardContent>
      </Card>
    </div>
  )
}

