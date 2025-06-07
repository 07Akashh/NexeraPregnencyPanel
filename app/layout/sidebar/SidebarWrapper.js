"use client"

import { Box } from "@mui/material"
import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import MobileSidebar from "./MobileSidebar"
import { sidebarConfig } from "./config"

export default function SidebarWrapper({ children }) {
  const [expanded, setExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [config, setConfig] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  
  // Remove direct localStorage access
  const [userType, setUserType] = useState(null)

  useEffect(() => {
    // Get user type from localStorage
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user'))
      setUserType(user?.user_type?.toLowerCase())
    }
  }, [])

  useEffect(() => {
    // Get user type from localStorage
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      if (user) {
        try {
          const userData = JSON.parse(user)
          const sidebarConfigData = sidebarConfig()
          setConfig(sidebarConfigData)
        } catch (error) {
          console.error('Error parsing user data:', error)
          setConfig(sidebarConfig())
        }
      } else {
        setConfig(sidebarConfig())
      }
    } else {
      setConfig(sidebarConfig())
    }
  }, [])

  const handleSectionClick = (section) => {
    if (section === "chats") setExpanded(!expanded)
  }

  const handleSidebarToggle = () => setMobileOpen(!mobileOpen)

  if (!config) {
    return null // or a loading spinner
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar
        expanded={expanded}
        onSectionClick={handleSectionClick}
        config={config}
      />
      <MobileSidebar
        open={mobileOpen}
        onClose={handleSidebarToggle}
        config={config}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: "margin 0.3s ease",
        }}
      >
        {children}
      </Box>
    </Box>
  )
} 