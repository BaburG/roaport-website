"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: "📊"
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: "📝"
  },
  {
    title: "Statistics",
    href: "/admin/statistics",
    icon: "📈"
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 border-r">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                pathname === item.href
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              <span>{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
} 