import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import AdminLayoutClient from "./admin-layout-client"

const inter = Inter({
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
    <div className={inter.className}>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </div>
  )
} 