"use client"

import { Box } from "@mui/material"
import SidebarWrapper from "../layout/sidebar/SidebarWrapper"
import Header from "../../components/Header"
import { useState } from "react"

export default function MainLayout({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [chatList, setChatList] = useState([])
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('language') || 'en'
    }
    return 'en'
  })

  const handleSectionClick = (section) => {
    if (section === "chats") setSidebarExpanded(!sidebarExpanded)
  }

  const handleSidebarToggle = () => setMobileOpen(!mobileOpen)

  const handleNewChat = async () => {
    // Implement new chat logic here
  }

  const handleChatSelect = (chatId) => {
    // Implement chat selection logic here
  }

  return (
    <Box sx={{ display: "flex", height: "100dvh", width: "100dvw", overflow: "hidden" }}>
      <SidebarWrapper
        expanded={sidebarExpanded}
        onSectionClick={handleSectionClick}
        chatList={chatList}
        mobileOpen={mobileOpen}
        onSidebarToggle={handleSidebarToggle}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
      />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: { xs: 0 },
          transition: "margin-left 0.3s ease",
          width: { xs: 0 }
        }}
      >
        <Header
          onNewChat={handleNewChat}
          onClearChat={() => window.location.reload()}
          onSidebarToggle={handleSidebarToggle}
          language={language}
          setLanguage={setLanguage}
        />
        {children}
      </Box>
    </Box>
  )
} 