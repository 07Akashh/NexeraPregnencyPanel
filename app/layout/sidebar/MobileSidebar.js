"use client"

import { Drawer, Box, Button } from "@mui/material"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"

export default function MobileSidebar({ open, onClose, config }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleSectionClick = (section) => {
    router.push(section.route)
    onClose()
  }

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: "block", sm: "none" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 240,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3
          }}
        >
          <Image
            src="/logo.png"
            alt="logo"
            width={42}
            height={42}
          />
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {config.sections.map((section) => {
            const Icon = section.icon
            const isActive = pathname.startsWith(section.route)

            return (
              <Button
                key={section.id}
                onClick={() => handleSectionClick(section)}
                startIcon={<Icon />}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: "8px",
                  py: '8px',
                  px: '12px',
                  backgroundColor: isActive ? config.styles.hoverColor : "#FFFFFF",
                  color: "primary.black",
                  fontSize: '15px',
                  "&:hover": {
                    backgroundColor: config.styles.hoverColor,
                  },
                }}
              >
                {section.label}
              </Button>
            )
          })}
        </Box>
      </Box>
    </Drawer>
  )
} 