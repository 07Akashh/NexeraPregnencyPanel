"use client"

import { useTheme, useMediaQuery } from "@mui/material"
import DesktopSidebar from "./DesktopSidebar"
import MobileSidebar from "./MobileSidebar"

export default function SidebarWrapper({ expanded, activeSection, onSectionClick, chatList, mobileOpen, onSidebarToggle, onChatSelect, onNewChat }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return isMobile ? (
    <MobileSidebar
      expanded={expanded}
      activeSection={activeSection}
      onSectionClick={onSectionClick}
      chatList={chatList}
      mobileOpen={mobileOpen}
      onSidebarToggle={onSidebarToggle}
      onChatSelect={onChatSelect}
      onNewChat={onNewChat}
    />
  ) : (
    <DesktopSidebar
      expanded={expanded}
      activeSection={activeSection}
      onSectionClick={onSectionClick}
      chatList={chatList}
      onChatSelect={onChatSelect}
      onNewChat={onNewChat}
    />
  )
}
