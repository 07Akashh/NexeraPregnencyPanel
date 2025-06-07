"use client"

import { Suspense } from "react"
import LoadingScreen from '../components/LoadingScreen'

export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      {/* <ChatContent /> */}
    </Suspense>
  )
} 