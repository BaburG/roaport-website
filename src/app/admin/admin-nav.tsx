'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <div className="flex gap-4">
      <Link 
        href="/admin/statistics"
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          pathname === '/admin/statistics'
            ? 'bg-[#1A2E4C] text-white'
            : 'text-gray-700 hover:text-[#1A2E4C] hover:bg-gray-100'
        }`}
      >
        Statistics
      </Link>
      <Link 
        href="/admin/reports"
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          pathname === '/admin/reports'
            ? 'bg-[#1A2E4C] text-white'
            : 'text-gray-700 hover:text-[#1A2E4C] hover:bg-gray-100'
        }`}
      >
        Reports
      </Link>
    </div>
  )
} 