import axios from 'axios'
import Cookies from 'js-cookie'

// === Config ===
const BASE_URL = 'https://preg.trystrangify.com'

// === Token & User Management ===
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
    Cookies.set('token', token, { expires: 7 })
  }
}

const setUser = (user) => {
  if (typeof window !== 'undefined') {
    const stringified = JSON.stringify(user)
    localStorage.setItem('user', stringified)
    Cookies.set('user', stringified, { expires: 7 })
  }
}

const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    Cookies.remove('token')
    Cookies.remove('user')
  }
}

// === Language Utility ===
const getLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'en'
  }
  return 'en'
}

// === Axios Instance ===
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: 'application/json' },
})

// === Interceptors ===
apiClient.interceptors.request.use(config => {
  if (config.url !== '/api/login') {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// === Helpers ===
const handle = async (req) => {
  try {
    const res = await req
    return res.data
  } catch (err) {
    const msg = err.response?.data?.message || err.message
    throw new Error(`API Error: ${msg}`)
  }
}

const toFormData = (data) => {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => fd.append(k, v))
  return fd
}

// === Auth ===
export const login = async (username, password) => {
  const res = await apiClient.post('/api/login', toFormData({ username, password }), {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  const token = res.data?.response?.access_token
  const user = res.data?.response?.user

  if (token) setToken(token)
  if (user) setUser(user)

  return res.data
}

export const logout = () => {
  clearAuth()
  window.location.href = '/login'
}

// === Language & Init ===
export const initializeChat = () =>
  handle(apiClient.get('/api/initialize', { params: { language: getLanguage() } }))

export const getLanguages = () =>
  handle(apiClient.get('/api/get_languages'))

export const saveLanguage = (chatId, language) =>
  handle(apiClient.post('/api/save_language', toFormData({
    chat_id: chatId,
    language_code: language
  }), {
    headers: { 'Content-Type': 'multipart/form-data' }
  }))

// === Chat ===
export const selectOption = (chatId, optionId) =>
  handle(apiClient.post('/api/select_option', toFormData({
    chat_id: chatId,
    option: optionId,
    language: getLanguage()
  }), {
    headers: { 'Content-Type': 'multipart/form-data' }
  }))

export const getOpenAIResponse = (chatId, languages, message, mother_id) =>
  handle(apiClient.post('/api/ai_interaction', toFormData({
    chat_id: chatId,
    language: getLanguage(),
    query: message,
    mother_id
  }), {
    headers: { 'Content-Type': 'multipart/form-data' }
  }))

// === Profile ===
export const getProfile = () =>
  handle(apiClient.get('/api/get_profile'))

export const submitBusinessProfile = (chatId, answers) =>
  handle(apiClient.post('/api/submit_business_profile', {
    chat_id: chatId,
    answers
  }))

// === Patient ===
export const getPatientDetails = (peteintId) =>
  handle(
    apiClient.get(
      '/api/get_patient_details',
      {
        params: { mother_id: peteintId }
      }
    )
  )

export const predictRiskByPateintId = async (pateintId) => {
  try {
    const response = await apiClient.get(
      '/api/predict-user-risk-by-mother-id',
      { params: { mother_id: pateintId } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching patient risk:', error);
    throw error;
  }
}

export const getStatsDetails = async () => {
  try {
    const response = await apiClient.get(
      '/api/get-config-details',
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching patient risk:', error);
    throw error;
  }
}

export const getUserList = async (limit = 10, page = 1) => {
  try {
    const response = await apiClient.get(
      '/api/get_users',
      { params: { limit, page } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching patient risk:', error);
    throw error;
  }
}

export const addUsers = (chatId, languages, message, mother_id) =>
  handle(apiClient.post('/api/add_users', toFormData({
    chat_id: chatId,
    language: getLanguage(),
    query: message,
    mother_id
  }), {
    headers: { 'Content-Type': 'multipart/form-data' }
  }))