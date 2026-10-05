'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Calendar, Gift, User, Home, Bell, Settings, LogIn, Menu, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const Navigation = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { cartItems } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // This is a placeholder for authentication state
  // In a real app, you would use a proper auth management solution
  const isAuthenticated = pathname !== '/auth'

  const handleAuthAction = () => {
    if (isAuthenticated) {
      // Logout logic here
      router.push('/auth')
    } else {
      router.push('/auth')
    }
  }

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/categories', icon: Gift },
    { name: 'Gifts', href: '/gifts', icon: Gift },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Cart', href: '/cart', icon: ShoppingCart, count: cartItems.length },
    ...(isAuthenticated
      ? [
          { name: 'Notifications', href: '/notifications', icon: Bell, iconOnly: true },
          { name: 'Settings', href: '/settings', icon: Settings, iconOnly: true },
          { name: 'Profile', href: '/profile', icon: User },
        ]
      : []),
  ]

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg font-black text-primary-foreground">
              G
            </span>
            <span className="text-xl font-bold text-primary">GiftWise</span>
          </Link>
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant={pathname === item.href ? 'default' : 'ghost'}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="w-4 h-4" />
                  {!item.iconOnly && <span className="ml-2">{item.name}</span>}
                  {!!item.count && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                      {item.count}
                    </span>
                  )}
                </Link>
              </Button>
            ))}
            <Button onClick={handleAuthAction} variant="outline">
              {isAuthenticated ? (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <div className={`${isMenuOpen ? 'block' : 'hidden'} px-2 pt-2 pb-3 space-y-1 sm:px-3`}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}                className={`flex min-h-[44px] items-center rounded-md px-3 py-2 text-base font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              onClick={() => setIsMenuOpen(false)}
            >                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.name}
                {!!item.count && (
                  <span className="ml-2 rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                    {item.count}
                  </span>
                )}
              </div>
            </Link>
          ))}
          <Button onClick={handleAuthAction} variant="outline" className="w-full mt-2 justify-center">
            <LogIn className="mr-2 h-4 w-4" />
            {isAuthenticated ? 'Logout' : 'Login'}
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

