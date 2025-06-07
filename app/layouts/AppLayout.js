"use client"

import { usePathname } from "next/navigation"
import MainLayout from "./MainLayout"

export default function AppLayout({ children }) {
  const pathname = usePathname()
  
  // Don't use MainLayout for login page
  if (pathname === "/login") {
    return children
  }

  // Use MainLayout for all other pages
  return <MainLayout>{children}</MainLayout>
} 