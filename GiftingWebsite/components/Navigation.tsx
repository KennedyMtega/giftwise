'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Bell,
  Calendar,
  Gift,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

const Navigation = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { cartItems } = useCart()
  const { session, isAdmin, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleAuthAction = () => {
    if (session) {
      signOut()
      setIsMenuOpen(false)
      router.push('/')
    } else {
      router.push(`/auth?returnTo=${encodeURIComponent(pathname)}`)
    }
  }

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/categories', icon: Gift },
    { name: 'Gifts', href: '/gifts', icon: Gift },
    { name: 'Cart', href: '/cart', icon: ShoppingCart, count: cartItems.length },
    ...(session
      ? [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, iconOnly: true },
          ...(isAdmin ? [{ name: 'Admin', href: '/admin', icon: ShieldCheck, iconOnly: true }] : []),
          { name: 'Calendar', href: '/calendar', icon: Calendar, iconOnly: true },
          { name: 'Notifications', href: '/notifications', icon: Bell, iconOnly: true },
          { name: 'Settings', href: '/settings', icon: Settings, iconOnly: true },
          { name: 'Profile', href: '/profile', icon: User, iconOnly: true },
        ]
      : []),
  ]

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-3 md:h-16">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="GiftWise home">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg font-black text-primary-foreground md:h-10 md:w-10">
              G
            </span>
            <span className="text-lg font-bold tracking-tight text-primary md:text-xl">
              GiftWise
            </span>
          </Link>

          {/* Desktop: labels for primary items at md+, icon-only extras from lg */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant={pathname === item.href ? 'default' : 'ghost'}
                asChild
                className={item.iconOnly ? 'hidden h-10 w-10 p-0 lg:inline-flex' : 'h-10 px-3'}
              >
                <Link
                  href={item.href}
                  aria-label={item.iconOnly ? item.name : undefined}
                  title={item.iconOnly ? item.name : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!item.iconOnly && <span className="ml-2 whitespace-nowrap">{item.name}</span>}
                  {!!item.count && (
                    <span className="ml-1.5 rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-[#000068]">
                      {item.count}
                    </span>
                  )}
                </Link>
              </Button>
            ))}
            {session ? (
              <span className="ml-1 hidden max-w-[9rem] truncate text-sm text-muted-foreground xl:inline">
                {session.name}
              </span>
            ) : null}
            <Button onClick={handleAuthAction} variant="outline" className="ml-2 h-10 px-4">
              {session ? (
                <>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </>
              )}
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className="md:hidden">
        <div
          className={`${isMenuOpen ? 'block' : 'hidden'} space-y-1 border-t px-2 pb-4 pt-2 sm:px-3`}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex min-h-[44px] items-center rounded-md px-3 py-2 text-base font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <item.icon className="h-4 w-4 shrink-0" />
                {item.name}
                {!!item.count && (
                  <span className="ml-1.5 rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-[#000068]">
                    {item.count}
                  </span>
                )}
              </div>
            </Link>
          ))}
          {session ? (
            <p className="px-3 py-1 text-sm text-muted-foreground">Signed in as {session.name}</p>
          ) : null}
          <Button
            onClick={handleAuthAction}
            variant="outline"
            className="mt-2 h-11 w-full justify-center"
          >
            {session ? (
              <>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" /> Login
              </>
            )}
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
