import {
  Box, List, ListItem, ListItemText, Typography, Divider, Avatar,
  ListItemButton
} from "@mui/material"
import { useSearchParams } from "next/navigation"

export default function SectionContent({ activeSection, chatList, onChatSelect }) {
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chat');

  switch (activeSection) {
    case "chats":
      return (
        <List>
          {chatList.map((chat) => (
            <ListItemButton
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              sx={{
                borderRadius: 2,
                py: 0.2,
                my: 0.1,
                backgroundColor: chat.id === chatId ? 'rgba(1, 7, 39, 0.05)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(1, 7, 39, 0.05)',
                  '& .chat-title': {
                    color: 'customGreen.main',
                  }
                },
                '& .chat-title': {
                  color: chat.id === chatId ? 'customGreen.main' : 'inherit',
                }
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    className="chat-title"
                    noWrap
                    sx={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {chat.title}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
      )
    case "user":
      return (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ mr: 2 }}>U</Avatar>
            <Typography variant="subtitle1">User Name</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            user@example.com
          </Typography>
          <Divider sx={{ my: 2 }} />
          <List>
            <ListItem button={true} >
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button={true}>
              <ListItemText primary="Account" />
            </ListItem>
            <ListItem button={true}>
              <ListItemText primary="Sign Out" />
            </ListItem>
          </List>
        </Box>
      )
    case "settings":
      return (
        <List>
          <ListItem button>
            <ListItemText primary="General" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Appearance" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Privacy" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Notifications" />
          </ListItem>
        </List>
      )
    case "files":
      return (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your uploaded files
          </Typography>
          <List>
            <ListItem button>
              <ListItemText primary="Document1.pdf" secondary="May 20, 2025" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Image.jpg" secondary="May 19, 2025" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Spreadsheet.xlsx" secondary="May 18, 2025" />
            </ListItem>
          </List>
        </Box>
      )
    default:
      return null
  }
}
