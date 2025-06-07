"use client"

import { useEffect, useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material"

import IosShareIcon from '@mui/icons-material/IosShare';
import MenuIcon from "./icons/MenuIcon"
import TranslateIcon from '@mui/icons-material/Translate';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Image from "next/image"
import { getLanguages } from "../lib/api";

export default function Header({ onNewChat, onSidebarToggle, language, setLanguage }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [languageAnchorEl, setLanguageAnchorEl] = useState(null)
  const [shareAnchorEl, setShareAnchorEl] = useState(null)
  const [languages, setLanguages] = useState([])

  const handleLanguageSelect = (languageCode) => {
    localStorage.setItem("language", languageCode);
    setLanguage(languageCode)
    handleLanguageMenuClose()
  }


  const fetchLanguage = async() => {
      const res = await getLanguages()
      setLanguages(res)
  }
  useEffect(()=>{
    fetchLanguage()
  },[])


  const shareOptions = [
    { id: "link", name: "Copy Link" },
    { id: "email", name: "Email" },
    { id: "pdf", name: "Export as PDF" },
  ]

  const handleLanguageMenuOpen = (event) => {
    setLanguageAnchorEl(event.currentTarget)
  }

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null)
  }

  const handleShareMenuOpen = (event) => {
    setShareAnchorEl(event.currentTarget)
  }

  const handleShareMenuClose = () => {
    setShareAnchorEl(null)
  }


  const handleShareSelect = (option) => {
    console.log(`Selected share option: ${option}`)
    handleShareMenuClose()
  }

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: "#FBFBFB",
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left side: Logo or Menu Icon on Mobile */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isMobile ? (
            <IconButton color="inherit" onClick={onSidebarToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Image
                  src="/headerLogo.svg"
                  alt="AI Assistant Logo"
                  width={265}
                  height={45}
                  style={{ marginRight: '8px' }}
                />
              </Box>
            </>
          )}
        </Box>

        {/* Right side */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {/* Language Selector */}
          <Tooltip title="Select Language">
            <Button
              variant="contained"
              startIcon={<TranslateIcon />}
              endIcon={
                <Box
                  sx={{
                    color: 'primary.icon',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <ExpandMoreIcon sx={{ fontSize: 24 }} />
                </Box>
              }
              onClick={handleLanguageMenuOpen}
              sx={{
                px: '18px',
                borderRadius: '45px',
                maxHeight: '35px',
                minWidth: isMobile ? 40 : undefined,
                textTransform: "none",
                fontFamily: 'Satoshi',
                backgroundColor: "#FFFFFF",
                boxShadow: "none",
                border: "0.79px solid #E5E6E9",
                color: "black",
                '&:hover': {
                  backgroundColor: "#f8f8f8",
                  boxShadow: "none",
                },
              }}
            >
              {languages.find((lang) => lang.name === language)?.code || "Language"}
            </Button>

          </Tooltip>
          <Menu anchorEl={languageAnchorEl} open={Boolean(languageAnchorEl)} onClose={handleLanguageMenuClose}>
            {languages.map((lang,index) => (
              <MenuItem key={index} onClick={() => handleLanguageSelect(lang.name)}>
                {lang.code}
              </MenuItem>
            ))}
          </Menu>

          {/* Share button - only show on desktop */}
          {/* {!isMobile && (
            <>
              <Tooltip title="Share">
                <Button
                  variant="contained"
                  endIcon={<IosShareIcon sx={{ fontSize: 17 }} />}
                  onClick={handleShareMenuOpen}
                  sx={{
                    px: '18px',
                    borderRadius: '45px',
                    minWidth: isMobile ? 40 : undefined,
                    textTransform: "none",
                    fontFamily: 'Satoshi',
                    backgroundColor: "#FFFFFF",
                    boxShadow: "none",
                    border: "0.79px solid #E5E6E9",
                    color: "black",
                    '&:hover': {
                      backgroundColor: "#f8f8f8",
                      boxShadow: "none",
                    },
                  }}
                >
                  Share
                </Button>

              </Tooltip>
              <Menu anchorEl={shareAnchorEl} open={Boolean(shareAnchorEl)} onClose={handleShareMenuClose}>
                {shareOptions.map((option) => (
                  <MenuItem key={option.id} onClick={() => handleShareSelect(option.id)}>
                    {option.name}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )} */}

          {/* New Chat */}
          {/* <Button
            variant="contained"
            color="primary"
            endIcon={<AutoAwesomeIcon />}
            onClick={onNewChat}
            sx={{ borderRadius: 45, minWidth: 120, textTransform: "none", fontFamily: 'Satoshi' }}
          >
            New Chat
          </Button> */}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
