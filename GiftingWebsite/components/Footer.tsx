import Link from 'next/link'
import { Apple, Facebook, Instagram, Play, Twitter, Youtube } from 'lucide-react'

import { categories } from '@/data/categories'

const shopLinks = [
  { href: '/gifts', label: 'All gifts' },
  { href: '/categories', label: 'All occasions' },
  { href: '/gifts?type=personalized', label: 'Personalized gifts' },
  { href: '/gifts?type=experiences', label: 'Gift cards & experiences' },
  { href: '/cart', label: 'Your cart' },
]

const supportLinks = [
  { href: '/help-center', label: 'Help Center' },
  { href: '/notifications', label: 'Order updates' },
  { href: '/profile', label: 'My account' },
  { href: '/settings', label: 'Settings' },
  { href: '/auth', label: 'Sign in' },
]

const socials = [
  { href: '#', label: 'Facebook', Icon: Facebook },
  { href: '#', label: 'Instagram', Icon: Instagram },
  { href: '#', label: 'Twitter', Icon: Twitter },
  { href: '#', label: 'YouTube', Icon: Youtube },
]

const appBadges = [
  {
    href: '#',
    label: 'Download the GiftWise app on the App Store',
    caption: 'Download on the',
    store: 'App Store',
    Icon: Apple,
  },
  {
    href: '#',
    label: 'Get the GiftWise app on Google Play',
    caption: 'Get it on',
    store: 'Google Play',
    Icon: Play,
  },
]

export function Footer() {
  return (
    <footer className="mt-auto bg-[#000068] text-white">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-lg font-black text-[#000068]">
                G
              </span>
              <span className="text-xl font-bold">GiftWise</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Curated gifts for every occasion, wrapped by hand and delivered the same day.
            </p>
            <div className="mt-4 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {appBadges.map(({ href, label, caption, store, Icon }) => (
                <a
                  key={store}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-11 items-center gap-2.5 rounded-lg border border-white/25 px-3 transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="flex flex-col leading-tight">
                    <span className="text-xs text-white/70">{caption}</span>
                    <span className="text-sm font-semibold">{store}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">Shop</h3>
            <ul className="mt-3 space-y-2">
              {shopLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">Occasions</h3>
            <ul className="mt-3 space-y-2">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.id}`}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">Support</h3>
            <ul className="mt-3 space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 GiftWise. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
