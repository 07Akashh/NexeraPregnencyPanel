export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

/**
 * Truncates a string to a specified length and adds ellipsis
 *
 * @param {string} str - The string to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} The truncated string
 */
export function truncateString(str, maxLength) {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}...`
}

/**
 * Sanitizes user input to prevent XSS attacks
 *
 * @param {string} input - The user input to sanitize
 * @returns {string} Sanitized input string
 */
export function sanitizeInput(input) {
  // Basic sanitization - for production, use a dedicated library
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

/**
 * Generates a unique ID for tracking purposes
 *
 * @returns {string} A unique string ID
 */
export function generateUniqueId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Logs application events with proper formatting
 *
 * @param {string} type - The type of log (info, error, warning)
 * @param {string} message - The log message
 * @param {any} data - Optional data to include in the log
 */
export function appLogger(type, message, data) {
  const timestamp = new Date().toISOString()
  const logPrefix = `[GOV-AI-CHAT][${timestamp}][${type.toUpperCase()}]`

  if (data) {
    console[type === "error" ? "error" : type === "warning" ? "warn" : "log"](`${logPrefix} ${message}`, data)
  } else {
    console[type === "error" ? "error" : type === "warning" ? "warn" : "log"](`${logPrefix} ${message}`)
  }
}

/**
 * Combines class names
 *
 * @param  {...any} classes - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}
