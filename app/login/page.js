"use client"

import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress } from "@mui/material"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login } from "../../lib/api"
import Cookies from 'js-cookie'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      router.push('/dashboard')
    }
  }, [router])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await login(username, password)
      const data = res.response
      console.log(data)
      if (data.access_token) {
        // Store user data and token in localStorage
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data))
        const userStr = JSON.stringify(data)
        Cookies.set('user', userStr, { expires: 7 })
        // Redirect based on user type
        const userType = data.user_type?.toLowerCase()
        switch (userType) {
          case 'patient':
            router.replace('/bot/patient')
            break
          case 'doctor':
            router.replace('/bot/staff')
            break
          case 'admin':
            router.replace('/admin')
            break
          default:
            setError('Invalid user type')
            return
        }
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      console.log(err)
      setError(err.message,'fwefw' || 'An error occurred during login')
      // Clear localStorage on error
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      bgcolor: "background.default"
    }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ mb: 4 }}
        >
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            autoFocus
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  )
} 