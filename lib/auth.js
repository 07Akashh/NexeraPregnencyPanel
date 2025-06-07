export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
  return null
}

export const getUserType = () => {
  const user = getUser()
  return user?.user_type?.toLowerCase() || null
}

export const isAuthenticated = () => {
  return !!getToken()
}

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }
}

export const hasAccess = (pathname) => {
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/api', '/_next', '/favicon.ico']
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return true
  }

  const userType = getUserType()
  if (!userType) {
    return false
  }

  // Define strict route access rules
  const routeAccess = {
    patient: [
      '/bot/patient',
      '/profile/patient',
      '/appointments/patient',
      '/patientlist',
      '/riskboard',
      '/documentation',
      '/theme',
      '/styles',
      '/layout'
    ],
    doctor: [
      '/bot/staff',
      '/patientlist',
      '/riskboard',
      '/documentation',
      '/theme',
      '/styles',
      '/layout',
      '/profile',
      '/patient'
    ],
    // admin: [
    //   '/bot/staff',
    //   '/appointments/admin',
    //   '/patients',
    //   '/admin',
    //   '/profile/admin',
    //   '/patientlist',
    //   '/riskboard',
    //   '/documentation',
    //   '/theme',
    //   '/styles',
    //   '/layout',
    //   '/auth'
    // ]
  }

  // Check if the current path matches any allowed route for the user type
  const allowedRoutes = routeAccess[userType] || []
  return allowedRoutes.some(route => pathname.startsWith(route))
} 