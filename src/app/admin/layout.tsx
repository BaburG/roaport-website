import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "../globals.css"
import AdminNav from "./admin-nav"

const geist = Geist({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Admin Dashboard | Hazard Report",
  description: "Administrative dashboard for Roaport road hazard reporting system.",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-[#1A2E4C]">Hazard Report Admin</h1>
                <AdminNav />
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
} 