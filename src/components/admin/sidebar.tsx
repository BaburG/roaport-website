"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <Link href="/admin/statistics">
            <Button
              variant={pathname === "/admin/statistics" ? "default" : "ghost"}
              className="w-full justify-start"
            >
              Statistics
            </Button>
          </Link>
          <Link href="/admin/reports">
            <Button
              variant={pathname === "/admin/reports" ? "default" : "ghost"}
              className="w-full justify-start"
            >
              Reports
            </Button>
          </Link>
        </nav>
      </div>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          Logout
        </Button>
      </div>
    </div>
  )
} 