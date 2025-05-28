import axios from 'axios';

const BASE_URL = 'http://13.233.96.166:4000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false,
});


// Utility for handling errors
const handleResponse = async (requestPromise) => {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (error) {
    // Extract message from server if available
    const message = error.response?.data?.message || error.message;
    throw new Error(`API Error: ${message}`);
  }
};

const getStoredLanguage = () => localStorage.getItem("language") || "en";


// API functions
export const initializeChat = async () => {
  const language = getStoredLanguage();
  return handleResponse(apiClient.get('/api/initialize'),{language});
};

export const getLanguages = async () => {
  return handleResponse(apiClient.get('/api/get_languages'));
};

export const saveLanguage = async (chatId, language) => {
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('language_code', language);

  return handleResponse(
    apiClient.post('/api/save_language', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  );
};


export const selectOption = async (chatId, optionId) => {
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('option', optionId);
  formData.append('language', getStoredLanguage());

  return handleResponse(
    apiClient.post('/api/select_option', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  );
};


export const getProfile = async () => {
  return handleResponse(apiClient.get('/api/get_profile'));
};

export const submitBusinessProfile = async (chatId, answers) => {
  return handleResponse(
    apiClient.post('/api/submit_business_profile', { chat_id: chatId, answers })
  );
};


export const getOpenAIResponse = async (chatId, languages, message) => {
  const language = getStoredLanguage();
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('language', language);
  formData.append('message', message);

  return handleResponse(
    apiClient.post('/api/get_response_open_ai', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  );
};
