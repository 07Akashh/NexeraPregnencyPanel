"use client"

import { Box, IconButton, Tooltip } from "@mui/material"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import LogoutIcon from '@mui/icons-material/Logout'
import Cookies from 'js-cookie'

export default function Sidebar({ expanded, onSectionClick, config }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleSectionClick = async (section) => {
    try {
      console.log('Current pathname:', pathname)
      console.log('Attempting navigation to:', section.route)
      
      router.push(section.route)
      
      if (onSectionClick) {
        onSectionClick(section.id)
      }
    } catch (error) {
      console.error('Navigation error:', error)
    }
  }


  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  
    // Clear cookies
    Cookies.remove('user')
    Cookies.remove('token')
  
    // Redirect to login
    window.location.href = '/login'
  }
  

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 2,
          px: 1,
          height: "100vh",
          justifyContent: "space-between" // This will push the logout button to the bottom
        }}
      >
        <Box>
          <Box
            sx={{
              mb: 3,
              backgroundColor: "#FFFFFF",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: 'hidden'
            }}
          >
            <Image
              src="/logo.png"
              alt="logo"
              width={42}
              height={42}
            />
          </Box>
          
          {/* Compact Icons */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            {config.sections.map((section) => {
              const Icon = section.icon
              const isActive = pathname.startsWith(section.route)

              return (
                <Tooltip key={section.id} title={section.label} placement="right">
                  <IconButton
                    onClick={() => handleSectionClick(section)}
                    sx={{
                      p: 1.5,
                      maxHeight: '42px',
                      maxWidth: '42px',
                      mb: 2,
                      "&:hover": {
                        backgroundColor: config.styles.hoverColor,
                        color: config.styles.activeColor,
                      },
                      backgroundColor: isActive ? config.styles.activeBackground : "#FFFFFF",
                      color: isActive ? config.styles.activeColor : config.styles.inactiveColor,
                      boxShadow: isActive
                        ? `
                          -1px 1px 3px 0px rgba(1, 7, 39, 0.1),
                          -3px 4px 5px 0px rgba(1, 7, 39, 0.09),
                          -7px 8px 6px 0px rgba(1, 7, 39, 0.05),
                          -12px 15px 7px 0px rgba(1, 7, 39, 0.01),
                          -18px 23px 8px 0px rgba(1, 7, 39, 0)
                        `
                        : `
                          -1px 1px 2px 0px rgba(199, 199, 199, 0.1),
                          -2px 2px 3px 0px rgba(199, 199, 199, 0.09),
                          -5px 5px 4px 0px rgba(199, 199, 199, 0.05),
                          -10px 9px 5px 0px rgba(199, 199, 199, 0.01),
                          -15px 14px 6px 0px rgba(199, 199, 199, 0)
                        `,
                    }}
                  >
                    <Icon />
                  </IconButton>
                </Tooltip>
              )
            })}
          </Box>
        </Box>

        {/* Logout Button */}
        <Box sx={{ mb: 2 }}>
          <Tooltip title="Logout" placement="right">
            <IconButton
              onClick={handleLogout}
              sx={{
                p: 1.5,
                maxHeight: '42px',
                maxWidth: '42px',
                "&:hover": {
                  backgroundColor: config.styles.hoverColor,
                  color: config.styles.activeColor,
                },
                backgroundColor: "#FFFFFF",
                color: config.styles.inactiveColor,
                boxShadow: `
                  -1px 1px 2px 0px rgba(199, 199, 199, 0.1),
                  -2px 2px 3px 0px rgba(199, 199, 199, 0.09),
                  -5px 5px 4px 0px rgba(199, 199, 199, 0.05),
                  -10px 9px 5px 0px rgba(199, 199, 199, 0.01),
                  -15px 14px 6px 0px rgba(199, 199, 199, 0)
                `,
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )
} 