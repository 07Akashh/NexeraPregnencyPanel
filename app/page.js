"use client"

import { Suspense } from "react"
import { Box } from "@mui/material"
import LoadingScreen from '../components/LoadingScreen'

export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      {/* <ChatContent /> */}
    </Suspense>
  )
} 