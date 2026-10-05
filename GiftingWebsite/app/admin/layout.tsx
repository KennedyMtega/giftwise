'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FolderTree, LayoutDashboard, Package, Receipt, ShieldCheck, Users } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/orders', label: 'Orders', icon: Receipt },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, ready, isAdmin } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!ready) return
    if (!session) router.replace('/auth?returnTo=/admin')
    else if (!isAdmin) router.replace('/dashboard')
  }, [ready, session, isAdmin, router])

  if (!ready || !session || !isAdmin) {
    return (
      <div className="rounded-xl border p-12 text-center text-muted-foreground">
        Checking admin access…
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
      <aside className="h-fit rounded-xl border bg-card p-3 shadow-sm">
        <p className="flex items-center gap-2 px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden /> Admin panel
        </p>
        <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {links.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-3 border-t pt-3">
          <Link
            href="/"
            className="flex h-11 items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            ← Back to store
          </Link>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
