import { Box, IconButton, Tooltip, Typography, Divider, Button, } from "@mui/material"
import SectionIcons from "./SectionIcons"
import SectionContent from "./SectionContent"
import Image from "next/image"
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
export default function DesktopSidebar({ expanded, activeSection, onSectionClick, chatList, onChatSelect, onNewChat }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: 70,
          backgroundColor: "#FBFBFB",
          // borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 2,
          height: "100vh",
        }}
      >
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
        <SectionIcons activeSection={activeSection} onSectionClick={onSectionClick} compact={true} />
      </Box>

      <Box
        sx={{
          width: expanded ? 240 : 0,
          transition: "width 0.3s",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          // borderRight: expanded ? "1px solid rgba(0, 0, 0, 0.12)" : "none",
          height: "100vh",
        }}
      >
        {expanded && (
          <Box sx={{ p: 2, height: "100%", overflow: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="subtitle1" fontSize={16} fontWeight={400}>
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </Typography>
              <SearchIcon sx={{ fontSize: 22, color: "primary.icon", cursor: "pointer" }} />
            </Box>

            <Button
              variant="outlined"
              onClick={onNewChat}
              sx={{
                // width: "209px",
                // height: "38px",
                mt:2,
                width:'100%',
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
              {/* Left Icon + Text */}
              <Box sx={{ display: "flex", alignItems: "center",gap:'7px' }}>
                <AddIcon fontSize="small" />
                <Typography
                  sx={{
                    fontFamily: "Satoshi",
                    fontWeight: 400,
                    fontSize: "12.88px",
                    lineHeight: "19.32px",
                    letterSpacing: "0%",
                    verticalAlign: "middle"
                  }}
                >
                  New Chat
                </Typography>
              </Box>

              {/* Right Icon */}
              <AutoAwesomeIcon fontSize="small" />
            </Button>
            {/* <Divider sx={{ mb: 2 }} /> */}
            <SectionContent activeSection={activeSection} chatList={chatList} onChatSelect={onChatSelect} />
          </Box>
        )}
      </Box>
    </Box>
  )
}