'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getToken, getUser, hasAccess } from '../lib/auth'

export default function RouteGuard({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken()
      const user = getUser()

      // Handle public routes
      if (pathname === '/login' || pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
        setIsAuthorized(true)
        return
      }

      // Check authentication
      if (!token || !user) {
        router.replace('/login')
        return
      }
console.log(pathname);

      console.log(hasAccess(pathname));

      // Check if user has access to the current route
      const hasRouteAccess = hasAccess(pathname)
      
      if (!hasRouteAccess) {
        const userType = user.user_type?.toLowerCase()
        let redirectUrl = '/login'

        // Define default routes for each user type
        switch (userType) {
          case 'patient':
            redirectUrl = '/bot/patient'
            break
          case 'doctor':
            redirectUrl = '/bot/staff'
            break
          case 'admin':
            redirectUrl = '/dashboard'
            break
          default:
            redirectUrl = '/login'
        }
        

        // Only redirect if we're not already on an allowed route
        if (!hasAccess(pathname)) {
          router.replace(redirectUrl)
          return
        }
      }

      // If we get here, the user has access to the route
      setIsAuthorized(true)
    }

    checkAuth()
  }, [pathname, router])

  // Show nothing while checking authorization
  if (!isAuthorized) {
    return null
  }

  return children
} 