import ReactMarkdown from "react-markdown"
import { Typography, Link, Box } from "@mui/material"

/**
 * Component for rendering markdown content with consistent styling
 *
 * @param {Object} props - Component props
 * @param {string} props.content - The markdown content to render
 */
export default function MarkdownRenderer({ content }) {
  return (
    <Box sx={{ width: '100%' }}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              {children}
            </Typography>
          ),
          h2: ({ children }) => (
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {children}
            </Typography>
          ),
          p: ({ children }) => (
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              {children}
            </Typography>
          ),
          a: ({ href, children }) => (
            <Link href={href} color="primary" target="_blank" rel="noopener noreferrer">
              {children}
            </Link>
          ),
          strong: ({ children }) => (
            <Typography component="span" sx={{ fontWeight: 600 }}>
              {children}
            </Typography>
          ),
          ul: ({ children }) => (
            <Box component="ul" sx={{ pl: 3, mb: 2, listStyleType: 'disc' }}>
              {children}
            </Box>
          ),
          ol: ({ children }) => (
            <Box component="ol" sx={{ pl: 3, mb: 2, listStyleType: 'decimal' }}>
              {children}
            </Box>
          ),
          li: ({ children }) => (
            <Box component="li" sx={{ display: 'list-item' }}>
              <Typography variant="body1" component="span">
                {children}
              </Typography>
            </Box>
          ),
          code: ({ inline, className, children }) => (
            <Box
              component={inline ? "code" : "pre"}
              sx={{
                bgcolor: 'grey.100',
                p: inline ? 0.5 : 2,
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.95em',
                display: 'inline-block',
                my: inline ? 0 : 2,
              }}
            >
              {children}
            </Box>
          ),
          blockquote: ({ children }) => (
            <Box
              component="blockquote"
              sx={{
                borderLeft: '4px solid',
                borderColor: 'grey.300',
                pl: 2,
                py: 1,
                my: 2,
                bgcolor: 'grey.50',
                borderRadius: '0 4px 4px 0',
              }}
            >
              {children}
            </Box>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  )
}
