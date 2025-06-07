import { Box, Typography, Button, } from "@mui/material"
import SectionContent from "./SectionContent"
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';


export default function DesktopSidebar({ expanded, activeSection, onSectionClick, chatList, onChatSelect, onNewChat }) {
  let user = {}
  if (typeof window !== 'undefined') {
    user = JSON.parse(localStorage.getItem('user'))
  }
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: expanded ? 240 : 0,
          transition: "width 0.3s",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          // borderRight: expanded ? "1px solid rgba(0, 0, 0, 0.12)" : "none",
          // height: "10vh",,
        }}
      >
        {expanded && (
          <Box sx={{ p: 2, height: "100%", overflow: "auto" }}>
            <Button
              variant="outlined"
              onClick={onNewChat}
              sx={{
                // width: "209px",
                // height: "38px",
                mt: 2,
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
              {/* Left Icon + Text */}
              <Box sx={{ display: "flex", alignItems: "center", gap: '7px' }}>
                <AddIcon fontSize="small" />
                <Typography
                  sx={{
                    fontFamily: "Satoshi",
                    fontWeight: 400,
                    fontSize: "12.88px",
                    lineHeight: "19.32px",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                  }}
                >
                  New Chat
                </Typography>
              </Box>
                {/* Right Icon */}
              <AutoAwesomeIcon fontSize="small" />
            </Button>
           {user?.mother_id && (
             <Typography 
             sx={{
              fontFamily: "Satoshi",
              fontWeight: 400,
              fontSize: "12.88px",
              lineHeight: "19.32px",
              letterSpacing: "0%",
              verticalAlign: "middle",
              color:'#77797F'
            }}
            >
                Patient Id: ID#{user?.mother_id}
              </Typography>
           )}
            {/* <Divider sx={{ mb: 2 }} /> */}
            <SectionContent activeSection={activeSection} chatList={chatList} onChatSelect={onChatSelect} />
          </Box>
        )}
      </Box>
    </Box>
  )
}