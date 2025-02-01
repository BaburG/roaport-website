"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"

const navItems = [
  { href: '/', label: 'Homepage' },
  { href: '/reports', label: 'Reports' },
  { href: '/map', label: 'Map' },
  { href: '/scoreboard', label: 'Scoreboard' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="px-10 bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">Hazard Reports</span>
          </Link>
          <nav className="flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium text-muted-foreground",
                  pathname === item.href && "text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
