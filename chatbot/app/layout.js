import './styles/fonts.css'
import "./globals.css"


// Application metadata for SEO and browser display
export const metadata = {
  title: "AI Assistant - Government Verified Application",
  description: "A secure and compliant AI assistant application for government use",
  authors: [{ name: "Government AI Division" }],
  viewport: "width=device-width, initial-scale=1",
}

/**
 * RootLayout component that wraps all pages
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The page content to be rendered within the layout
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: "hidden", fontFamily: "Satoshi, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
