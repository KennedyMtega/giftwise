'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Receipt, Settings, User } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/orders', label: 'Orders', icon: Receipt },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, ready } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (ready && !session) router.replace('/auth?returnTo=/dashboard')
  }, [ready, session, router])

  if (!ready || !session) {
    return (
      <div className="rounded-xl border p-12 text-center text-muted-foreground">
        Loading your dashboard…
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hi, {session.name.split(' ')[0]}</h1>
          <p className="text-sm text-muted-foreground">{session.email}</p>
        </div>
        {session.role === 'admin' ? (
          <Link
            href="/admin"
            className="inline-flex h-10 items-center rounded-lg border border-primary/40 px-4 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Open admin panel
          </Link>
        ) : null}
      </div>

      <div className="flex gap-1 overflow-x-auto border-b pb-px">
        {tabs.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'inline-flex h-11 shrink-0 items-center gap-2 rounded-t-lg border-b-2 px-4 text-sm font-medium transition-colors',
                active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          )
        })}
      </div>

      <div>{children}</div>
    </div>
  )
}
