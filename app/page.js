"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Suspense } from "react"
import LoadingScreen from '../components/LoadingScreen'
import { getToken, getUser } from '../lib/auth'

export default function ChatPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken()
        const user = getUser()

        if (!token || !user) {
          router.replace('/login')
          return
        }

        // Redirect based on user type
        const userType = user.user_type?.toLowerCase()
        switch (userType) {
          case 'patient':
            await router.replace('/bot/patient')
            break
          case 'doctor':
            await router.replace('/bot/staff')
            break
          case 'admin':
            await router.replace('/bot/admin')
            break
          default:
            await router.replace('/login')
        }
      } catch (error) {
        console.error('Error during authentication check:', error)
        router.replace('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      {/* <ChatContent /> */}
    </Suspense>
  )
} 