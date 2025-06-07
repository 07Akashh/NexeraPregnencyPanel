"use client"

import { Box, Typography, Button } from "@mui/material"
import { usePathname } from "next/navigation"
import { sidebarConfig } from "./config"

export default function ExpandedContent({ 
  expanded, 
  chatList, 
  onChatSelect, 
  onNewChat,
  children // This allows pages to pass their own content
}) {
  const pathname = usePathname()

  if (!expanded) return null

  return (
    <Box
      sx={{
        width: 0,
        transition: "width 0.3s",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        height: "100vh",
      }}
    >
      <Box sx={{ p: 2, height: "100%", overflow: "auto" }}>
        {/* Section Title */}
        <Typography variant="subtitle1" fontSize={16} fontWeight={400} sx={{ mb: 2 }}>
          {sidebarConfig().sections.find(section => pathname.startsWith(section.route))?.label || "Menu"}
        </Typography>

        {/* New Chat Button - Only show in chats section */}
        {pathname.startsWith('/bot/pateint') && (
          <Button
            variant="outlined"
            onClick={onNewChat}
            sx={{
              width: '100%',
              py: "10px",
              borderRadius: "41px",
              backgroundColor: 'primary.main',
              color: 'background.paper',
              border: "1px solid #77797F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              textTransform: "none",
              mb: 2
            }}
          >
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontWeight: 400,
                fontSize: "12.88px",
                lineHeight: "19.32px",
              }}
            >
              New Chat
            </Typography>
          </Button>
        )}

        {/* Chat List - Only show in chats section */}
        {pathname.startsWith('/chats') && chatList && (
          <Box>
            {chatList.map((chat) => (
              <Button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderRadius: 2,
                  py: 0.2,
                  my: 0.1,
                  backgroundColor: chat.id === pathname.split('/').pop() ? sidebarConfig().styles.hoverColor : 'transparent',
                  '&:hover': {
                    backgroundColor: sidebarConfig().styles.hoverColor,
                  }
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    color: chat.id === pathname.split('/').pop() ? 'customGreen.main' : 'inherit',
                  }}
                >
                  {chat.title}
                </Typography>
              </Button>
            ))}
          </Box>
        )}

        {/* Custom content from pages */}
        {children}
      </Box>
    </Box>
  )
} 