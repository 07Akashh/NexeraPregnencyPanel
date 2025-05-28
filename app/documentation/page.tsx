import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Breadcrumbs,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import Link from "next/link"
import HomeIcon from "@mui/icons-material/Home"
import DescriptionIcon from "@mui/icons-material/Description"

export default function DocumentationPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb navigation */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link href="/" passHref>
          <MuiLink sx={{ display: "flex", alignItems: "center" }} underline="hover" color="inherit">
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Home
          </MuiLink>
        </Link>
        <Typography sx={{ display: "flex", alignItems: "center" }} color="text.primary">
          <DescriptionIcon sx={{ mr: 0.5 }} fontSize="small" />
          Documentation
        </Typography>
      </Breadcrumbs>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Assistant Documentation
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Government Verification Document ID: GOV-AI-CHAT-2025
        </Typography>
        <Divider sx={{ my: 3 }} />

        {/* Application Overview */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            1. Application Overview
          </Typography>
          <Typography paragraph>
            This AI Assistant is a conversational interface that allows users to interact with an artificial
            intelligence model. The application is built using Next.js, Material UI, and the AI SDK with OpenAI
            integration. It follows all government regulations for AI systems and maintains high standards for security,
            privacy, and accessibility.
          </Typography>
          <Typography paragraph>
            The application is designed with a light color palette and a clean, intuitive interface that makes it easy
            for users to engage in natural language conversations with the AI.
          </Typography>
        </Box>

        {/* Technical Architecture */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            2. Technical Architecture
          </Typography>
          <Typography paragraph>
            The application follows a client-server architecture with the following components:
          </Typography>

          <TableContainer component={Paper} elevation={0} sx={{ mb: 3, bgcolor: "grey.50" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Component</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Technology</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Frontend</TableCell>
                  <TableCell>User interface for chat interaction</TableCell>
                  <TableCell>Next.js, React, Material UI</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Backend API</TableCell>
                  <TableCell>Processes chat messages and communicates with AI model</TableCell>
                  <TableCell>Next.js API Routes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>AI Integration</TableCell>
                  <TableCell>Handles communication with AI model</TableCell>
                  <TableCell>AI SDK, OpenAI</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>State Management</TableCell>
                  <TableCell>Manages application state and chat history</TableCell>
                  <TableCell>React Hooks</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" gutterBottom>
            2.1 Data Flow
          </Typography>
          <Typography paragraph>
            1. User enters a message in the chat interface 2. Message is sent to the Next.js API route 3. API route
            forwards the message to OpenAI via the AI SDK 4. AI generates a response 5. Response is streamed back to the
            client 6. UI updates to display the new message
          </Typography>
        </Box>

        {/* Security & Compliance */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            3. Security & Compliance
          </Typography>

          <Typography variant="h6" gutterBottom>
            3.1 Data Security
          </Typography>
          <Typography paragraph>
            - All communication with the AI model is encrypted using HTTPS - No user data is stored persistently on the
            server - Chat history is maintained only in the client&apos;s browser session - Input validation is implemented
            to prevent injection attacks
          </Typography>

          <Typography variant="h6" gutterBottom>
            3.2 Compliance Features
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="WCAG 2.1 AA Accessibility Compliance"
                secondary="The application follows Web Content Accessibility Guidelines to ensure it is usable by people with disabilities."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Content Moderation"
                secondary="The AI is configured to refuse generating harmful, illegal, or unethical content."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Transparency"
                secondary="Clear indication when interacting with an AI system rather than a human."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Audit Logging"
                secondary="System events are logged for security and compliance purposes."
              />
            </ListItem>
          </List>
        </Box>

        {/* Usage Guidelines */}
        <Box>
          <Typography variant="h5" gutterBottom>
            4. Usage Guidelines
          </Typography>
          <Typography paragraph>
            This AI Assistant is designed to provide information and assistance within legal and ethical boundaries. The
            system:
          </Typography>
          <Typography component="div">
            <ul>
              <li>Will not generate content that promotes harm, illegal activities, or discrimination</li>
              <li>
                Provides factual information to the best of its abilities but should not be the sole source for critical
                decisions
              </li>
              <li>Maintains user privacy by not storing conversation data beyond the current session</li>
              <li>Is designed to be accessible to users with disabilities</li>
              <li>Provides clear documentation for government verification purposes</li>
            </ul>
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}
