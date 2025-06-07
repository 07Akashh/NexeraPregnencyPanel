import { Box, Button } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"

const sections = [
  { id: "chats", icon: ChatIcon, label: "Chats" },
  // { id: "user", icon: PersonIcon, label: "User" },
  // { id: "settings", icon: SettingsIcon, label: "Settings" },
  // { id: "files", icon: FolderIcon, label: "Files" },
]

export default function SectionIconList({ activeSection, onSectionClick }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 1, px: 1 }}>
      {sections.map((section) => {
        const Icon = section.icon
        const isActive = activeSection === section.id

        return (
          <Button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            startIcon={<Icon />}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              fontWeight: 500,
              borderRadius: "8px",
              py:'8px',
              px:'12px',
              backgroundColor: isActive ? "rgba(1, 7, 39, 0.05)" : "#FFFFFF",
              color: "primary.black",
              fontSize:'15px',
              "&:hover": {
                backgroundColor: isActive ? "rgba(1, 7, 39, 0.05)" : "",
              },
            }}
          >
            {section.label}
          </Button>
        )
      })}
    </Box>
  )
}
