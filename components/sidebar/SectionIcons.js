import { Box, IconButton, Tooltip, Typography } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import PersonIcon from "@mui/icons-material/Person"
import SettingsIcon from "@mui/icons-material/Settings"
import FolderIcon from "@mui/icons-material/Folder"

const sections = [
  { id: "chats", icon: ChatIcon, label: "Chats" },
  // { id: "user", icon: PersonIcon, label: "User" },
  // { id: "settings", icon: SettingsIcon, label: "Settings" },
  // { id: "files", icon: FolderIcon, label: "Files" },
]

export default function SectionIcons({ activeSection, onSectionClick, compact }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: compact ? "center" : "flex-start", px: 2 }}>
      {sections.map((section) => (
        <Tooltip key={section.id} title={compact ? section.label : ""} placement="right">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              mb: 2,
              cursor: "pointer",
              borderRadius: 50,
            }}
            onClick={() => onSectionClick(section.id)}
          >
            <IconButton
              color={activeSection === section.id ? "#FEFFFF" : "primary.icon"}
              sx={{
                p: 1.5,
                maxHeight: '42px',
                maxWidth: '42px',
                "&:hover": {
                  backgroundColor: activeSection === section.id ? "primary.light" : "rgba(0, 0, 0, 0.04)",
                },
                backgroundColor: activeSection === section.id ? "primary.main" : "#FFFFFF",
                color: activeSection === section.id ? "#FEFFFF" : "primary.icon",
                boxShadow: activeSection === section.id
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
              <section.icon />
            </IconButton>
            {!compact && (
              <Typography variant="body2" sx={{ ml: 2, fontWeight: 500 }}>
                {section.label}
              </Typography>
            )}
          </Box>
        </Tooltip>
      ))}
    </Box>
  )
}