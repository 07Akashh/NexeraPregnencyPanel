"use client"

import {
  Box,
  Paper,
  Typography,
  Avatar,
  CircularProgress,
  Button,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import PersonIcon from "@mui/icons-material/Person"
import MarkdownRenderer from "./MarkdownRenderer"
import Image from "next/image"
import ChatInputBar from './ChatInputBar'
import { getTranslation } from '../lib/translation'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function MessageBubble({ role, content }) {
  return (
    <Box sx={{ mb: 2, display: "flex" }}>
      <Avatar sx={{ bgcolor: role === "user" ? "transparent" : "customGreen.main", mr: 2, color: role === "user" ? "customGreen.main" : "background.paper", 
            border: role === "user" ? "2px solid " : "none",
            borderColor: role === "user" ? "#EBECEE" : "primary.main",  }}>
        {role === "user" ? <PersonIcon /> : <AutoAwesomeIcon />}
      </Avatar>
      <Box sx={{ maxWidth: "80%" }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            bgcolor: role === "user" ? "transparent" : "primary.100", 
            borderRadius: role === "user" ? "14px" : 2,
            border: role === "user" ? "2px solid " : "none",
            borderColor: role === "user" ? "#EBECEE" : "primary.main",
            pt: role === "user" ? "9px" : 2,
            pr: role === "user" ? "12px" : 2,
            pb: role === "user" ? "0px" : 0,
            pl: role === "user" ? "12px" : 2,
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <MarkdownRenderer content={content} />
        </Paper>
      </Box>
    </Box>
  )
}

function MessageOptions({ options, onSelect }) {
  return (
    <Box sx={{ mt: 2, ml: 7 }}>
      {options.map(option => (
        <Button
        key={option.id}
        variant="outlined"
        sx={{ mr: 1, mb: 1 }}
        onClick={() => onSelect(option.id)}
      >
        {option.label || option.text}
      </Button>
      ))}
    </Box>
  )
}

function LoadingIndicator({ language }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", ml: 7, mt: 2 }}>
      <CircularProgress size={20} sx={{ mr: 2 }} />
      <Typography variant="body2" color="text.secondary">
        {getTranslation("thinking", language)}
      </Typography>
    </Box>
  )
}

function ErrorMessage({ language }) {
  return (
    <Box sx={{ ml: 7, mt: 2, color: "error.main" }}>
      <Typography variant="body2">
        {getTranslation("error", language)}
      </Typography>
    </Box>
  )
}

function EmptyChatMessage({ language }) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "text.secondary",
        px: 2,
        textAlign: "center",
      }}
    >
      <Image
        src="/chatAreaIcon.svg"
        alt="Nexera X Govt of Telangana"
        width={164}
        height={55}
        style={{ marginRight: "8px", maxWidth: "100%", height: "auto" }}
      />
      <Typography variant="h4" sx={{ mt: 2, color: "primary.main", fontSize: { xs: "1.5rem", sm: "2rem" } }}>
        {getTranslation("greeting", language)}
      </Typography>
      <Typography variant="body2" sx={{ mt: 2, maxWidth: 400 }}>
        {getTranslation("intro", language)}
      </Typography>
    </Box>
  )
}

export default function ChatArea({
  messages,
  input,
  handleInputChange,
  onSubmit,
  isLoading,
  error,
  messagesEndRef,
  language,
  options,
  handleOptionClick,
  setLanguage,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
        p: 2,
        pt:0,
        backgroundColor: "background.default",
        overflow: "auto",
      }}
    >
      <Box sx={{ backgroundColor: "background.default", p: 2, mb: 0, flexGrow: 1, overflow: "auto" }}>
        {messages.length === 0 ? (
          <EmptyChatMessage language={language} />
        ) : (
          messages.map(msg => <MessageBubble key={msg.id} role={msg.role} content={msg.content} />)
        )}

        {options?.length > 0 && <MessageOptions options={options} onSelect={handleOptionClick} />}
        {isLoading && <LoadingIndicator language={language} />}
        {error && <ErrorMessage language={language} />}

        <div ref={messagesEndRef} />
      </Box>

      <ChatInputBar input={input} handleInputChange={handleInputChange} onSubmit={onSubmit} isLoading={isLoading} language={language} setLanguage={setLanguage} />
    </Box>
  )
}
