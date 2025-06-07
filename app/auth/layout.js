"use client"

import { Box } from "@mui/material"

export default function AuthLayout({ children }) {

  return (
    <Box sx={{
      display: "flex",
      height: "100dvh",
      width: "100dvw",
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center"
    }}>
      {children}
    </Box>
  )
} 