import React, { useState } from "react"
import {
  Paper,
  TextField,
  IconButton,
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import MicIcon from "@mui/icons-material/Mic"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NorthIcon from '@mui/icons-material/North';
import AutoAwesomeTwoToneIcon from "@mui/icons-material/AutoAwesomeTwoTone"
import { getLanguages, saveLanguage } from "../lib/api"
import { useSearchParams } from "next/navigation"

export default function ChatInputBar({
  input,
  handleInputChange,
  onSubmit,
  isLoading,
  language,
  setLanguage,
}) {
  const [rows, setRows] = useState(1)
  const [languages, setLanguages] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chat');

  const handleSourcesClick = async (event) => {
    setAnchorEl(event.currentTarget)
    if (languages.length === 0) {
      const langs = await getLanguages()
      setLanguages(langs)
    }
  }

  const handleClose = () => setAnchorEl(null)

  const handleLanguageSelect = async (lang) => {
    localStorage.setItem("language", lang.code)
    setLanguage(lang.code)
    await saveLanguage(chatId, lang.code)
    handleClose()
  }

  return (
    <Box
      sx={{
        width: {
          xs: "100%",
          sm: "95%",
          md: "90%",
          lg: "80%",
        },
        maxWidth: "900px",
        mx: "auto",
        px: { xs: 1.5, sm: 3 },
        pb: 2,
      }}
    >
      <Paper
        component="form"
        onSubmit={onSubmit}
        elevation={3}
        sx={{
          borderRadius: 6,
          p: 2,
          bgcolor: "background.paper",
        }}
      >
        {/* Text Area */}
        <TextField
          multiline
          fullWidth
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <AutoAwesomeTwoToneIcon
                sx={{ fontSize: 20, color: "primary.main", mr: 1, mt: 0.5 }}
              />
            ),
            sx: {
              fontSize: "1rem",
              px: 1,
              pb: 1,
              alignItems: "flex-start",
            },
          }}
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => {
            handleInputChange(e)
            const lines = e.target.value.split("\n").length
            setRows(Math.min(Math.max(lines, 1), 10))
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (e.shiftKey) {
                // Shift + Enter → New line
                return
              } else {
                // Enter → Submit
                e.preventDefault()
                if (!isLoading && input.trim()) {
                  onSubmit(e)
                }
              }
            }
          }}
          rows={rows}
          autoComplete="off"
          variant="standard"
          sx={{
            border: "none",
            outline: "none",
            resize: "none",
            "& textarea": {
              border: "none !important",
              outline: "none !important",
              backgroundColor: "transparent",
            },
          }}
        />

        {/* Button Row (below text area) */}
        <Box
          sx={{
            mt: 1,
            px: 0.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <></>
          {/* Sources button */}
          <Button
            variant="contained"
            endIcon={<ExpandMoreIcon sx={{ fontSize: 17 }} />}
            onClick={handleSourcesClick}
            sx={{
              display: { xs: "none", sm: "flex" },
              px: '18px',
              borderRadius: '45px',
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
            Select Sources
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {languages.map((lang, idx) => (
              <MenuItem key={idx} selected={lang.code === language} onClick={() => handleLanguageSelect(lang)}>
                {lang.name}
              </MenuItem>
            ))}
          </Menu>
          {/* Action buttons */}
          <Box sx={{ display: "flex", gap: 1, mt: { xs: 1, sm: 0 } }}>
            {/* <Button
              variant="contained"
              startIcon={<AttachFileIcon sx={{ fontSize: 17 }} />}
              // onClick={handleShareMenuOpen}
              sx={{
                px: '18px',
                borderRadius: '45px',
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
              Attach
            </Button>
            <Button
              variant="contained"
              startIcon={<MicIcon sx={{ fontSize: 17 }} />}
              // onClick={handleShareMenuOpen}
              sx={{
                px: '18px',
                borderRadius: '45px',
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
              Voice
            </Button> */}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              onSubmit={onSubmit}
              disabled={isLoading || !input.trim()}
              startIcon={<NorthIcon />}
              sx={{
                borderRadius: 45, minWidth: 80, textTransform: "none", fontFamily: 'Satoshi', "&:hover": {
                  bgcolor: "primary.dark",
                },
                "&.Mui-disabled": {
                  bgcolor: "action.disabledBackground",
                  color: "action.disabled",
                },
              }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Disclaimer */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          mt: 1.5,
          fontSize: "0.75rem",
          opacity: 0.7,
          display: "block",
          textAlign: "center",
          width: "100%",
        }}
      >
        Nexera.health may display inaccurate info, so please double check the
        response. Your Privacy & Nexera.health
      </Typography>

    </Box>
  )
}
